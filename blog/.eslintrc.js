module.exports = {
  root: true,
  env: { browser: true, node: true, es2021: true },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: [
    'airbnb',
    'prettier',
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  overrides: [],
  rules: {
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: [
          'site/**',
          'tests/**',
          'scripts/**',
          '**/*.test.js',
          '**/__tests__/*',
          '*.config.js',
          '**/*.md',
        ],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/no-array-index-key': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'global-require': 0,
  },
}
