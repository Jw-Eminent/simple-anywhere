const util = require('util');
const path = require('path');
const fs = require('fs');
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const { root } = require('../config/defaultConf')

module.exports = async function (request, response, currentpPath) {
  try {
    const stats = await stat(currentpPath);
    if (stats.isFile()) {
      response.setHeader('Content-Type', 'text/plain');
      fs.createReadStream(currentpPath).pipe(response); // 创建一个可读的文件流 边读边写
    } else if (stats.isDirectory()) {
      const files = await readdir(currentpPath);
      response.setHeader('Content-Type', 'text/html');
      for (const file of files) {
        const absolutePath = path.resolve(currentpPath, file); // 获取当前文件或文件夹的绝对路径
        const href = `/${path.relative(root, absolutePath)}`; // 获取当前文件或文件夹相对于root的路径
        response.write(`<a href=${href}>${file}</a></br>`);
      }
      response.end();
    }
  } catch (error) {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end(`Error: ${currentpPath} is not a file or directory`);
  }
}
