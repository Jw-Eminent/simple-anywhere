const http = require('http');
const path = require('path');
const defConf = require('./config/defaultConf');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');

class Server {
  constructor(config) {
    this.conf = Object.assign({}, defConf, config);
  }

  start() {
    const {port, hostname, root} = this.conf;
    const server = http.createServer((req, res) => {
      const currentPath = path.join(root, req.url);
      route(req, res, currentPath, root);
    });

    server.listen(port, hostname, () => {
      const addr = `http://${hostname}:${port}/`;
      console.info(`Server running at ${addr}`);
      openUrl(addr);
    });
  }
}

module.exports = Server;
