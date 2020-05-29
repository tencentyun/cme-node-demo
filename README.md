![](https://main.qcloudimg.com/raw/17831a2c06a9b16fc26d35571d616cfc.jpg)

## 简介
本项目是腾讯云剪为开发者提供的接入 Demo，Demo 里面包含云剪基础功能实现，开发者可以通过 Demo 体验云剪的功能并通过实际的代码查看接入云剪的方式。

## 功能特性
* [x] 简单的用户登录
* [x] 创建视频编辑项目
* [x] 上传本地文件成为素材
* [x] 编辑预览
* [x] 导出视频结果

## 安装使用
### 环境准备
云剪提供的 Demo 是基于 Node.js 开发的，在运行 Demo 之前需要检查本地是否安装了 Node.js，若没有安装 Node.js 的可以登录官网进行包进行快速安装，具体参考：[Node.js 安装包下载](https://nodejs.org)。

### 源码下载
开发者也可以直接在本地通过 git 命令下载代码：
```
git clone https://github.com/tencentyun/cme-node-demo.git
```
### 安装运行
Demo 依赖一些其他的包，首先需要通过 npm 安装依赖，开发者通过命令行跳到项目的根目录下，并执行安装命令：
```
cd cme-node-demo/
npm install
```
在项目下有个核心的配置文件`config.js`，开发者将实际参数填写到对应位置上：
```js
const config = {
  port: 9090,
  secretId: "You SecretId",
  secretKey: "Your SecretKey",
  platform: "Your Platform"
};
```

依赖安装完成后，运行启动命令：
```
npm start
```
Demo 运行成功后，我们在浏览器输入`http://localhost:9090`即可进入 Demo 的显示页面。

## 变更记录
每个版本的变更细节都记录在日志中，具体请看：[变更日志](https://github.com/tencentyun/cme-node-demo/releases)。

## 贡献者
感谢以下的开发者对项目的大力支持，欢迎更多的开发者参与进来！

<a href="https://github.com/xujianguo"><img width=50 height=50 src="https://avatars1.githubusercontent.com/u/7297536?s=60&v=4" /></a><a href="https://github.com/Saro50"><img width=50 height=50 src="https://avatars3.githubusercontent.com/u/1996216?s=60&v=4" /></a>

## 许可证
[MIT](https://github.com/tencentyun/cme-node-demo/blob/master/LICENSE)
