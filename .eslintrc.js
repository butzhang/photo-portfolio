module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  overrides: [
    {
      files: ['scripts/*.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        'no-useless-escape': 'off',
      },
    },
  ],
}
