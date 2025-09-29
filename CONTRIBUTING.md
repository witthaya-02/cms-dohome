# Contributing Guide

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to maintain a consistent commit history and enable automatic changelog generation.

### Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **perf**: A code change that improves performance
- **ci**: Changes to our CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

### Examples

```bash
feat: add user authentication
fix: resolve login button styling issue
docs: update API documentation
refactor: simplify user validation logic
test: add unit tests for user service
chore: update dependencies
```

### Using Commitizen

Instead of `git commit`, use:

```bash
npm run commit
```

This will launch an interactive prompt to help you create properly formatted commit messages.

### Scopes (Optional)

You can add a scope to provide additional contextual information:

```bash
feat(auth): add login functionality
fix(ui): resolve button alignment issue
docs(api): update endpoint documentation
```

### Breaking Changes

For breaking changes, add `!` after the type/scope or include `BREAKING CHANGE:` in the footer:

```bash
feat!: remove deprecated API endpoints
feat(auth)!: change authentication flow

# Or in footer:
feat: update user model

BREAKING CHANGE: user.name field renamed to user.fullName
```

### Development Workflow

1. **Make your changes**
2. **Stage your files**: `git add .`
3. **Create a commit**: `npm run commit`
4. **Push your changes**: `git push`

### Git Hooks

This project uses Husky to run pre-commit hooks that:

- Format code with Prettier
- Lint code with ESLint
- Run TypeScript type checking
- Validate commit messages with commitlint

### Available Scripts

- `npm run commit` - Interactive commit with Commitizen
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript compiler check
- `npm run check-all` - Run all checks (type-check, lint, format)
