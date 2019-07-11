const http = require('http');
const path = require('path');
const fs = require('fs');
const defConf = require('./config/defaultConf');
const { port, hostname, root } = defConf;

const server = http.createServer((req, res) => {
  const currentPath = path.join(root, req.url);
  fs.stat(currentPath, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Error: ${currentPath} is not a file or directory`);
      return;
    }
    res.statusCode = 200;
    if (stats.isFile()) {
      res.setHeader('Content-Type', 'text/plain');
      fs.createReadStream(currentPath).pipe(res); // 创建一个可读的文件流 边读边写
    }
    if (stats.isDirectory()) {
      fs.readdir(currentPath, (err, files) => {
        if (!err) {
          res.setHeader('Content-Type', 'text/html');
          for (const file of files) {
            const absolutePath = path.resolve(currentPath, file); // 获取当前文件或文件夹的绝对路径
            const href = `/${path.relative(root, absolutePath)}`; // 获取当前文件或文件夹相对于root的路径
            res.write(`<a href=${href}>${file}</a></br>`);
          }
          res.end();
        }
      });
    }
  });
});

server.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
