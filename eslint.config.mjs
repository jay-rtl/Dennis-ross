import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
export default tseslint.config(
  {
    ignores: [
      '.next/**',
      '.next-qa/**',
      '.pages-build/**',
      '.preview/**',
      'test-results/**',
      'test-results-content/**',
      'playwright-report/**',
      'next-env.d.ts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: { 'react-hooks': hooks, 'jsx-a11y': a11y },
    rules: {
      ...hooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      'jsx-a11y/anchor-is-valid': 'off',
    },
    settings: { 'jsx-a11y': { components: { Link: 'a', Image: 'img' } } },
  },
);
