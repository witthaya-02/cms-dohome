module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type enum - define allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc)
        'refactor', // Code refactoring
        'test', // Adding or modifying tests
        'chore', // Maintenance tasks
        'perf', // Performance improvements
        'ci', // CI/CD changes
        'build', // Build system changes
        'revert', // Reverting commits
      ],
    ],
    // Subject case - allow sentence case
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    // Subject length
    'subject-max-length': [2, 'always', 100],
    // Subject empty
    'subject-empty': [2, 'never'],
    // Header max length
    'header-max-length': [2, 'always', 100],
    // Body max line length
    'body-max-line-length': [2, 'always', 100],
    // Footer max line length
    'footer-max-line-length': [2, 'always', 100],
  },
};
