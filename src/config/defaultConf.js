module.exports = {
  hostname: '127.0.0.1',
  port: '8888',
  root: process.cwd(),
  compressReg: /\.(html|js|css|md)/,
  cache: {
    maxAge: 1000,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}
