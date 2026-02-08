module.exports = {
  extends: [
    'next/core-web-vitals',
    // Add any other extends you might be using
  ],
  rules: {
    // Add any custom rules here
  },
  overrides: [
    {
      // Disable ESLint rules for script files
      files: ['scripts/*.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        'no-useless-escape': 'off',
      },
    },
  ],
}
