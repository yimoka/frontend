import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tencentBase from 'eslint-config-tencent/base'
import tencentImport from 'eslint-config-tencent/import'

export default tseslint.config(
  { ignores: ['dist', 'build', "**/*.d.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...tencentBase.rules,
      ...tencentImport.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // 复杂度限制
      complexity: ['warn', 10],
      'no-unused-vars': "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "args": "after-used",
          "ignoreRestSiblings": true,
          "argsIgnorePattern": "^_.+",
          "varsIgnorePattern": "^_.+"

        }
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          warnOnUnassignedImports: true,
          pathGroupsExcludedImportTypes: [
            'builtin',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'external',
              position: 'after',
            },
          ],
        },
      ],
    },
  },
)
