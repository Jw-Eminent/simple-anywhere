/**
 * 通过request headers中的Accept-Encoding
 * 设置response的Content-Encoding
 * 压缩相应文件 减小文件体积
 */
const {createGzip, createDeflate} = require('zlib');

module.exports = (readStream, req, res) => {
  const accepetEncoding = req.headers['accept-encoding'];
  const regMatchGzipOrDeflate = /\b(gzip|deflate)\b/;
  const regMathGzip = /\bgzip\b/;
  const regMatchDeflate = /\bdefalate\b/;
  if (!accepetEncoding || !regMatchGzipOrDeflate.test(accepetEncoding)) {
    return readStream;
  } else if (regMathGzip.test(accepetEncoding)) {
    res.setHeader('Content-Encoding', 'gzip');
    return readStream.pipe(createGzip());
  } else if (regMatchDeflate.test(accepetEncoding)) {
    res.setHeader('Content-Encoding', 'deflate');
    return readStream.pipe(createDeflate());
  }
}
