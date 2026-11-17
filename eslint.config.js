// ESLint, for what TypeScript does not check: the rules of React's hooks
// (a hook after an early return, or inside a callback, breaks a page at
// run time). The hooks' dependency lists are only warned about; where one is
// left short on purpose, the line says so (eslint-disable-next-line).
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
