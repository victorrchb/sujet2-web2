module.exports = {
    env: {
      node: true,
      es2021: true,
      jest: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
      ecmaVersion: 12
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'semi': ['error', 'always']
    }
  };
  