const util = require('util');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const { root } = require('../config/defaultConf')

const tplPath = path.join(__dirname, '../template/filelist.html');
const tplSource = fs.readFileSync(tplPath, 'utf-8');
const template = Handlebars.compile(tplSource);

module.exports = async function (request, response, currentpPath) {
  try {
    const stats = await stat(currentpPath);
    response.statusCode = 200;
    if (stats.isFile()) {
      response.setHeader('Content-Type', 'text/plain');
      fs.createReadStream(currentpPath).pipe(response); // 创建一个可读的文件流 边读边写
    } else if (stats.isDirectory()) {
      const files = await readdir(currentpPath);
      const dirPath = path.relative(root, currentpPath);
      const data = {
        title: path.basename(currentpPath), // path.basename() 方法返回 path 的最后一部分
        dirPath: dirPath ? `/${dirPath}` : '',
        files
      };
      response.setHeader('Content-Type', 'text/html');
      response.end(template(data));
      // for (const file of files) {
      //   const absolutePath = path.resolve(currentpPath, file); // 获取当前文件或文件夹的绝对路径
      //   const href = `/${path.relative(root, absolutePath)}`; // 获取当前文件或文件夹相对于root的路径
      //   response.write(`<a href=${href}>${file}</a></br>`);
      // }
      // response.end();
    }
  } catch (error) {
    console.error(error);
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end(`Error: ${currentpPath} is not a file or directory`);
  }
}
