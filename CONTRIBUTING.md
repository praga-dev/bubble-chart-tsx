# Contributing to bubble-chart-tsx

First off, thank you for considering contributing to `bubble-chart-tsx`! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related bugs.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy-pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and explain precisely what is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which help you demonstrate the steps or the part of the problem.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including entirely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior and explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to most `bubble-chart-tsx` users.

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `beginner` and `help-wanted` issues:

- **Beginner issues** - issues which should only require a few lines of code, and a test or two.
- **Help wanted issues** - issues which should be a bit more involved than beginner issues.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- Use TypeScript for all new code.
- Avoid using `any` whenever possible; prefer `unknown` or specific interfaces.
- Ensure all public APIs are documented with JSDoc comments.

### React Styleguide

- Use functional components and hooks.
- Keep components small and focused on a single responsibility.
- Use `memo` and `useCallback` judiciously to optimize performance for high-density rendering.

## Pull Request Process

1.  Fork the repository and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  If you've changed APIs, update the documentation.
4.  Ensure the test suite passes (`npm test`).
5.  Make sure your code lints.
6.  Issue that pull request!

## Local Development

```bash
# Clone the repository
git clone https://github.com/Srisha-Ravi/bubble-chart-tsx.git

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

---

Thank you for your contribution!
