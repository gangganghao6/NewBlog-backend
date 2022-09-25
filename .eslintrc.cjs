module.exports = {
  'env': {
    'node': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-standard-with-typescript',
    'prettier'
  ],
  'overrides': [],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  'plugins': [
    '@typescript-eslint',
    'prettier'
  ],
  'rules': {
    'prettier/prettier': 'error',
    'dot-notation': 'off'
  }
}
