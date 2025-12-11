# Contributing to SWT2526

This document outlines guidelines and best practices for developers working on this project.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Color System](#color-system)
- [Commit Conventions](#commit-conventions)

## Development Workflow

### Before Every Commit/Push

**Always run these commands before committing:**

```bash
yarn format    # Auto-format code with Prettier
yarn test:run  # Run all tests
```

The CI pipeline will automatically check these, but running them locally saves time and prevents failed builds.

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run `yarn format` and `yarn test:run`
4. Push your branch: `git push origin your-branch-name`
5. Create a Pull Request on GitHub
6. Wait for CI checks to pass
7. Request review from team members

## Code Style

### Formatting

We use **Prettier** for code formatting. The configuration is in `.prettierrc.json`.

- **Auto-format**: `yarn format`
- **Check only**: `yarn format:check`

### Linting

We use **ESLint** for code quality. The configuration is in `eslint.config.js`.

- **Auto-fix**: `yarn lint`
- **Check only**: `yarn lint:check`

## Testing

### Test IDs

**Always add `data-testid` attributes to HTML elements that need testing.**

#### Why?

- Tests are more resilient to UI changes
- No dependency on CSS classes or HTML structure
- Clearer intent in test code

#### Example

```vue
<template>
  <div data-testid="shape-wrapper" class="absolute select-none">
    <button data-testid="delete-button" @click="handleDelete">Delete</button>
  </div>
</template>
```

```typescript
// In tests
const wrapper = mount(Component)
const deleteButton = wrapper.find('[data-testid="delete-button"]')
```

#### Naming Convention

- Use kebab-case: `data-testid="my-component"`
- Be descriptive: `data-testid="submit-form-button"` not `data-testid="btn"`
- Include component context: `data-testid="toolbar-add-rectangle"` not `data-testid="add"`

### Running Tests

```bash
yarn test        # Watch mode (development)
yarn test:run    # Run once (CI)
yarn test -u     # Update snapshots
```

## Color System

### Location

All colors are defined in `src/assets/colors.css` as CSS custom properties (variables).

### Available Colors

We use the **Modell Aachen** color palette with semantic naming:

#### Primary Colors

```css
--ma-primary-100 to --ma-primary-900  /* Brand blue */
```

#### Greys

```css
--ma-grey-100 to --ma-grey-900  /* Neutral greys */
```

#### Semantic Colors

```css
--ma-danger          /* Error/delete actions */
--ma-warning         /* Warning states */
--ma-text-01         /* Primary text */
--ma-text-02         /* Secondary text */
--ma-text-03         /* Tertiary text */
--bg-maincontent     /* Main background */
```

#### Status Colors

```css
--ma-green-* /* Success states */
--ma-red-*   /* Error states */
--ma-yellow-* /* Warning states */
```

### Usage in Classes

**Use Tailwind utility classes with these variables:**

```vue
<template>
  <!-- Good: Uses CSS variable -->
  <div class="bg-ma-primary-500 text-ma-text-01">
    <button class="border-ma-danger bg-ma-danger text-white">Delete</button>
  </div>

  <!-- Bad: Hardcoded colors -->
  <div class="bg-blue-500 text-black">
    <button class="border-red-600 bg-red-600 text-white">Delete</button>
  </div>
</template>
```

### Dark Mode

The color system automatically adapts to dark mode. Colors in `.dark-mode` class are inverted appropriately.

**Do not hardcode colors.** Always use CSS variables so dark mode works correctly.

## Commit Conventions

We follow **Conventional Commits** for automatic changelog generation.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD changes

### Examples

```bash
feat(toolbar): add dark mode toggle button
fix(grid): resolve canvas click event propagation
docs(readme): update installation instructions
test(shapes): add tests for trapezoid component
chore(deps): upgrade vue to 3.5.24
```

### Why?

- Auto-generates `CHANGELOG.md` on every merge to `main`
- Groups changes by type for better readability
- Makes git history searchable and meaningful

## CI/CD

### Workflows

1. **CI** (`.github/workflows/ci.yml`)
   - Runs on Pull Requests
   - Checks: Prettier, Tests

2. **Changelog** (`.github/workflows/changelog.yml`)
   - Runs when PR is merged to `main`
   - Auto-generates `CHANGELOG.md`

### Branch Protection

The `main` branch is protected:

- Requires passing CI checks
- Requires code review
- Must be up-to-date with `main` before merging
