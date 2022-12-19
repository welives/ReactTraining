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
    // 规定不能引入未在package.json在声明的模块
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
    'jsx-a11y/click-events-have-key-events': 0, // 要求绑定了onClick事件的元素，必须有一个 key 事件
    'jsx-a11y/no-noninteractive-element-interactions': 0, // 要求非交互元素不能绑定事件
    'jsx-a11y/no-static-element-interactions': 0, // 要求静态元素不能绑定事件
    'react/default-props-match-prop-types': 0, // 要求defaultProps 必须有对应的 propTypes
    'react/destructuring-assignment': 0, // 要求props, state, context必须使用解构
    'react/display-name': 0, // 要求组件必须有 displayName 属性
    'react/forbid-prop-types': 0, // 禁用某些propTypes
    'react/function-component-definition': 0,
    'react-hooks/exhaustive-deps': 0, // 要求hooks必须有依赖项
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // 限制文件后缀
    'react/jsx-indent': 0, // jsx 的缩进规则
    'react/jsx-no-bind': 0, // 禁止在JSX中使用箭头函数和bind
    'react/jsx-no-constructed-context-values': 0,
    'react/jsx-one-expression-per-line': 0,
    // 多行的 jsx 必须有括号包起来
    'react/jsx-wrap-multilines': [2, { declaration: false, assignment: false }],
    'react/no-array-index-key': 0, // 禁止使用数组的 index 作为 key
    'react/no-unused-class-component-methods': 1, // 组件内禁止出现未被使用的方法
    'react/prop-types': 0, // 要求使用propTypes验证
    'react/require-default-props': 0, // 要求组件必须有 defaultProps
    'react/sort-comp': 0, // 要求组件内的方法按特定顺序书写
    'react/state-in-constructor': 0, // 要求state必须在构造函数中声明
    camelcase: 1, // 要求使用驼峰法命名
    'no-shadow': 0, // 禁止变量声明与外层作用域的变量同名
    'no-unused-vars': [1, { vars: 'all', args: 'none' }], // 禁止未使用过的变量
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 禁止使用debugger
    'no-console': 0, // 禁止使用console
    'global-require': 0,
  },
}
