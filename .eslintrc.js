module.exports = {
  'root': true,
  'parser': 'babel-eslint',
  'env': {
    'browser': true,
    'node': true
  },
  'extends': 'standard',
  'plugins': [
    'html'
  ],
  'rules': {
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-console': [
      'error',
      {
        'allow': ['info', 'error'],
      }
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'no-implicit-coercion': 'error',
    'default-case': 'error',
    'eqeqeq': 'error',
    'no-shadow': 'error',
    'no-unreachable': 'error',
    'no-var': 'error',
    'no-magic-numbers': 'error'
  }
}