module.exports = {
  extends: [
    'prettier',
    'airbnb-base',
  ],
  rules: {
    'max-len': [1, 125],
    'func-names': ['error', 'never'],
    'no-use-before-define': ['error', { functions: false, variables: false }],
  },
  parserOptions: {
    ecmaVersion: 12,
  },
};
