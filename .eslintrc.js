module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jquery: true
  },
  extends: [
    'standard'
  ],
  globals: {
    CustomEvent: 'readonly',
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    InsertNewRow: 'readonly',
    DeleteRow: 'readonly'
  },
  plugins: [
    'html'
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
  }
}
