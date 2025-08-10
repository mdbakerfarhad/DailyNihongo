import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['**/*.json'],
    plugins: {
      js,
      react: pluginReact
    },
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      }
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // ✅ Turn off this rule for React 17+
    },
    settings: {
      react: {
        version: 'detect' // ✅ Automatically detect React version
      }
    }
  },
  tseslint.configs.recommended
]);
