const camelcaseRule = [
  0,
  {
    properties: 'never',
    ignoreDestructuring: true,
    allow: ['font_size', 'font_color', 'text_x', 'text_y', 'text_width'],
  },
]

module.exports = {
  root: true,
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:vue/essential',
  ],
  plugins: ['vue'],
  rules: {
    '@typescript-eslint/camelcase': camelcaseRule, // 驼峰
    '@typescript-eslint/explicit-function-return-type': 0, // 函数显式返回类型
    '@typescript-eslint/no-non-null-assertion': 0, // 使用 ! 禁止非空断言
    '@typescript-eslint/no-explicit-any': 0, // 禁用 any
    '@typescript-eslint/class-name-casing': 1, // 类名 pascal
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/interface-name-prefix': 'never', // interface 使用 I 开头
    '@typescript-eslint/no-unused-vars': 0, // 禁止没有使用的变量
    '@typescript-eslint/explicit-member-accessibility': 'no-public', // 显式的可访问性修饰符
    // 'prefer-const': [1, { destructuring: 'all' }], // 使用 const 定义没有被修改的变量
    'no-const-assign': 2, // 禁止修改 const
    'no-var': 2, // 禁用 var
    camelcase: camelcaseRule, // 驼峰命名
    'object-shorthand': 2, // 对象定义使用简略语法
    'no-array-constructor': 2, // 不允许使用 constructor 定义数组
    'prefer-template': 2, // 使用 ` 连接字符串
    'no-multi-assign': 2, // 禁用链式定义，代码难以阅读
    'prefer-rest-params': 2, // 使用解构语法
    'no-unused-vars': 0, // 未使用的变量
    'func-style': 0, // 函数声明的风格
    'one-var': 2, // 多个变量声明
    quotes: 1, // 字符串规则
    'standard/computed-property-even-spacing': 'off', // 当 obj[prop] 太长时，prettier会自动换行。这个rule与 prettier 的规则冲突了。
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-unused-vars': ['off'],
        'no-undef': ['off'],
      },
    },
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  env: {
    node: true,
  },
  globals: {
    yunjian: true,

    // mocha
    describe: true,
    it: true,
    before: true,
    beforeEach: true,
    after: true,
    afterEach: true,
    // END mocha
  },
}
