import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsoncParser from 'jsonc-eslint-parser';
import jsoncPlugin from 'eslint-plugin-jsonc';

export default [
  // ======================================================
  // Base TS / JS config
  // ======================================================
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      // TS relax
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Prettier
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 300,
        },
      ],

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // ======================================================
  // JSON / JSONC files
  // ======================================================
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc: jsoncPlugin,
    },
    rules: {
      ...jsoncPlugin.configs['recommended-with-jsonc'].rules,
      'jsonc/indent': ['error', 2],
      'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
    },
  },

  // ======================================================
  // Global ignores
  // ======================================================
  {
    ignores: ['.eslintrc.js'],
  },

  // ======================================================
  // Env equivalents
  // ======================================================
  {
    languageOptions: {
      globals: {
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        jest: 'readonly',
      },
    },
  },
];
