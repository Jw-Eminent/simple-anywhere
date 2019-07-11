const http = require('http');
const path = require('path');
const defConf = require('./config/defaultConf');
const route = require('./helper/route');
const { port, hostname, root } = defConf;

const server = http.createServer((req, res) => {
  const currentPath = path.join(root, req.url);
  route(req, res, currentPath);
});

server.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
