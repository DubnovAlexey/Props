// ESLint — «проверяющий» кода: находит ошибки до запуска.
// Правила минимальные: рекомендованные для JavaScript + два главных правила
// хуков (порядок вызова и полный массив зависимостей). Оформление (отступы,
// кавычки) проверяет не ESLint, а Prettier.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist/', 'dist-artifact/', 'node_modules/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Компоненты используются в JSX — их имена с большой буквы не считаем «лишними»
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },
  {
    // Сервис-воркер работает в своём окружении
    files: ['build/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.serviceworker } },
  },
];
