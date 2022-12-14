// 因为接收的是一个异步promise,所以当异步方法进入reject时可以直接catch
module.exports = (cb) => (req, res, next) => cb(req, res, next).catch(next)
