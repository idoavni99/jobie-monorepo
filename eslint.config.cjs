const nx = require('@nx/eslint-plugin');
const unicorn = require('eslint-plugin-unicorn');

module.exports = [
  unicorn.configs['flat/recommended'],
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/dev-dist',
      '**/*.e2e.ts',
      '**/playwright.config.ts',
      '**/webpack.config.js',
      '**/vite.config.ts',
      '**/metro.config.js',
      '**/.babelrc.js',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [String.raw`^.*/eslint(\.base)?\.config\.[cm]?js$`],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'unicorn/prefer-top-level-await': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    // Override or add rules here
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'pascalCase',
        },
      ],
    },
  },
];
