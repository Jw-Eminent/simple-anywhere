/**
 * 使用util.promisify方法将异步回调变为同步的形式
 * 避免了回调地狱的出现 增加代码可读性
 */
const util = require('util');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const { root, compressReg } = require('../config/defaultConf');
const mime = require('./mime');
const compress = require('./compress');
const isFresh = require('./cache');

// 引入模板 通过模板引擎进行编译
const tplPath = path.join(__dirname, '../template/filelist.html');
const tplSource = fs.readFileSync(tplPath, 'utf-8');
const template = Handlebars.compile(tplSource);

module.exports = async function (request, response, currentPath) {
  try {
    const stats = await stat(currentPath);
    if (stats.isFile()) {
      // 通过mime类型设置正确的contentType
      const contentType = mime(currentPath);
      response.setHeader('Content-Type', contentType);

      // 判断请求的内容是否过期 是否需要重新获取
      if (isFresh(stats, request, response)) {
        response.statusCode = 304;
        response.end();
        return;
      }
      response.statusCode = 200;

      // 创建一个可读的文件流
      let readStream = fs.createReadStream(currentPath);

      // 对匹配的文本文件进行压缩
      if (currentPath.match(compressReg)) {
        readStream = compress(readStream, request, response);
      }
      readStream.pipe(response);
      // fs.createReadStream(currentPath).pipe(response);
    } else if (stats.isDirectory()) {
      const files = await readdir(currentPath);
      const dirPath = path.relative(root, currentPath);
      const data = {
        // path.basename() 方法返回 path 的最后一部分
        title: path.basename(currentPath),
        dirPath: dirPath ? `/${dirPath}` : '',
        files
      };
      response.setHeader('Content-Type', 'text/html');
      response.end(template(data));
    }
  } catch (error) {
    console.error(error);
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end(`Error: ${currentPath} is not a file or directory`);
  }
}
