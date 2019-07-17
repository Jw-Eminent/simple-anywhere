/**
 * 通过request headers中的Accept-Encoding
 * 设置response的Content-Encoding
 * 压缩相应文件 减小文件体积
 */
const {createGzip, createDeflate} = require('zlib');

module.exports = (readStream, req, res) => {
  const accepetEncoding = req.headers['accept-encoding'];
  if (!accepetEncoding || !accepetEncoding.match(/\b(gzip|deflate)\b/)) {
    return readStream;
  } else if (accepetEncoding.match(/\bgzip\b/)) {
    res.setHeader('Content-Encoding', 'gzip');
    return readStream.pipe(createGzip());
  } else if (accepetEncoding.match(/\bdefalate\b/)) {
    res.setHeader('Content-Encoding', 'deflate');
    return readStream.pipe(createDeflate());
  }
}
