import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat()

export default [
  // Include the new flat config recommended preset
  js.configs.recommended,

  // Convert your old .eslintrc rules, without "eslint:recommended"
  ...compat.config({
    parserOptions: {
      ecmaVersion: 2020,
    },
    env: {
      browser: true,
      node: true,
    },
    extends: [
      // removed "eslint:recommended"
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    rules: {
      // your custom rules here
    },
  }),
]
