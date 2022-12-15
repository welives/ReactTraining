/**
 * 使用方法: 传入一个异步promise，当reject的时候会自动捕获错误并丢给全局异常处理中间件
 * @param {Function} cb
 * @returns
 */
module.exports = (cb) => (req, res, next) => cb(req, res, next).catch(next)
