const chalk = require('chalk')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let path = require('path')

let localConfig = {
  watch: true,
  entry: {
    main: './src/main.ts',
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[name].js',
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.less$/,
        loader: 'less-loader',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.less'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/demo.html',
    }),
  ],
}
// let testConfig = require("./test.config");
// let releaseConfig = require("./release.config");
let package = require('./package.json')

// console.log(chalk.blueBright(`node_env ${process.env.NODE_ENV}`));

function print(arg) {
  console.log(chalk.redBright(arg))
}

print('开始构建')

function getConfig(env) {
  switch (env) {
    case 'local':
      return localConfig
    case 'development':
      return developConfig
    // case "test":
    //   return testConfig;
    // case "release":
    //   return releaseConfig;
  }
}
/**
 *
 * @param {string} projectVersionStr '0.0.0' 版本号基本结构,
 *    第一个数字表示接口版本，接口不变的情况下该版本号不会改变
 *    第二位数表示功能实现的版本,实现不变更的化，不变化
 *    第三个数字表示当前接口和实现下的小迭代次数，每次迭代提交都会自动加一
 */
function getFileVersion(projectVersionStr) {
  return Number(projectVersionStr[0])
}

module.exports = function (env, argv) {
  let config = localConfig
  print(`当前处理版本${package.version}`)

  return localConfig
}
