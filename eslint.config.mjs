import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: ['**/.next/**', '**/dist/**', '**/node_modules/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  {
    files: ['packages/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@saasflix/application*'], message: 'Domain layer must not import application layer.' },
            { group: ['@saasflix/security*'], message: 'Domain layer must stay pure; consume security from orchestrators.' },
            { group: ['apps/*'], message: 'Domain layer cannot import deployable apps.' }
          ]
        }
      ]
    }
  }
];
