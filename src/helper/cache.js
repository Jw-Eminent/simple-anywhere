/**
 * Setting up a cache reduces the number of requests
 */
const {cache} = require('../config/defaultConf');

function refreshRes(stats, response) {
  const {maxAge, expires, cacheControl, lastModified, etag} = cache;
  // Expires头   Expires: 绝对时间 GMT时间 string
  const expiresTime = new Date(Date.now() + maxAge * 1000).toUTCString();
  if (expires) {
    response.setHeader('Expires', expiresTime);
  }

  if (cacheControl) {
    response.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    response.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if (etag) {
    response.setHeader('ETag', `${stats.size}-${stats.mtime}`);
  }
}

module.exports = function isFresh(stats, request, response) {
  refreshRes(stats, response);

  const lastModified = request.headers['If-modified-since'];
  const etag = request.headers['if-none-match'];

  if (!lastModified && !etag) {
    return false;
  }

  const lastModifiedFromRes = response.getHeader('Last-Modified');
  if (lastModified && lastModified !==lastModifiedFromRes) {
    return false;
  }

  const etagFromRes = response.getHeader('ETag');
  if (etag && etag !== etagFromRes) {
    return false;
  }

  return true;
};
