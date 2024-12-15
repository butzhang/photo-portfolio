// eslint.config.cjs
const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')



const compat = new FlatCompat()

module.exports = [
  js.configs.recommended,
  ...compat.config({
    parserOptions: {
      ecmaVersion: 2020,
    },
    env: {
      browser: true,
      node: true,
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    rules: {
      // your custom rules here
    },
  }),
]
