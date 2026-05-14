export type UpdateMode = 'raf' | 'throttle' | 'debounce';

export interface BatchScheduler {
  schedule(fn: () => void): void;
  flush(): void;     // call on unmount to drain orphaned tasks
  cancel(): void;    // call on unmount to prevent post-unmount execution
  setMode(mode: UpdateMode): void;
}

export function createBatchScheduler(initialMode: UpdateMode = 'raf'): BatchScheduler {
  const queue: Array<() => void> = [];
  let timerId: ReturnType<typeof setTimeout> | number | null = null;
  let cancelled = false;
  let mode = initialMode;

  function run() {
    timerId = null;
    if (cancelled) {
      queue.length = 0;
      return;
    }
    // Drain a snapshot — new items pushed during execution go to next frame
    const snapshot = queue.splice(0);
    for (const fn of snapshot) fn();
  }

  function clearTimer() {
    if (timerId !== null) {
      if (mode === 'raf') {
        cancelAnimationFrame(timerId as number);
      } else {
        clearTimeout(timerId as ReturnType<typeof setTimeout>);
      }
      timerId = null;
    }
  }

  return {
    setMode(newMode: UpdateMode) {
      if (mode === newMode) return;
      mode = newMode;
      // Note: we do not reset the timer here, to avoid interrupting an ongoing batch.
      // The next schedule will use the new mode.
    },

    schedule(fn) {
      if (cancelled) return;
      queue.push(fn);
      
      if (timerId === null) {
        if (mode === 'raf') {
          timerId = requestAnimationFrame(run);
        } else if (mode === 'throttle') {
          // Simple throttle: run max once every 100ms
          timerId = setTimeout(run, 100);
        } else if (mode === 'debounce') {
          timerId = setTimeout(run, 100);
        }
      } else if (mode === 'debounce') {
        // Debounce: reset the timeout if it's called again before executing
        clearTimeout(timerId as ReturnType<typeof setTimeout>);
        timerId = setTimeout(run, 100);
      }
    },

    flush() {
      // Synchronously execute everything pending (needed on unmount)
      clearTimer();
      const snapshot = queue.splice(0);
      for (const fn of snapshot) fn();
    },

    cancel() {
      cancelled = true;
      clearTimer();
      queue.length = 0;
    },
  };
}
