const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
