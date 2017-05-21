module.exports = {
  'env': {
    'node': true
  },
  'extends': 'standard',
  "parserOptions": {
      "sourceType": "module"
  },
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
      'always'
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