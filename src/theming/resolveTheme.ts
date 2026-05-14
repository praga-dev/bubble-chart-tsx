import type { ResolvedTheme } from '../adapter/ChartAdapter';

const LIGHT_THEME: ResolvedTheme = {
  background:   '#ffffff',
  text:         '#1a1a1a',
  bubbleColors: ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'],
};

const DARK_THEME: ResolvedTheme = {
  background:   '#0f0f0f',
  text:         '#f5f5f5',
  bubbleColors: ['#4cc9f0', '#4361ee', '#7209b7', '#f72585', '#3a0ca3'],
};

export function resolveTheme(
  theme: 'light' | 'dark' | Partial<ResolvedTheme> | undefined
): ResolvedTheme {
  if (!theme || theme === 'light') return LIGHT_THEME;
  if (theme === 'dark')            return DARK_THEME;

  // Partial object — merge with light as the base
  return { ...LIGHT_THEME, ...theme };
}
