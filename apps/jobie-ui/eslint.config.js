import nx from '@nx/eslint-plugin';
import reactCompiler from 'eslint-plugin-react-compiler';
import baseConfig from '../../eslint.config.js';

export default [
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
