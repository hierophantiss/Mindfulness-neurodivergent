// ESLint, for what TypeScript does not check: the rules of React's hooks
// (a hook after an early return, or inside a callback, breaks a page at
// run time), and accessibility in the markup (jsx-a11y: what can be clicked
// can also be reached and used with the keyboard and a screen reader). The hooks' dependency lists are only warned about; where one is
// left short on purpose, the line says so (eslint-disable-next-line).
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // A scrolling region takes the keyboard's focus so it can be scrolled
      // (axe: scrollable-region-focusable); it is a named region.
      'jsx-a11y/no-noninteractive-tabindex': ['error', { tags: [], roles: ['tabpanel', 'region'], allowExpressionValues: true }],
      // Focus is moved on purpose: into a dialog's field, and to the button
      // that wakes the dimmed screen.
      'jsx-a11y/no-autofocus': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
