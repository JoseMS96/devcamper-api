const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
// Async/Await will throw an error if something goes wrong, which usually means that you should wrap your code in a try/catch
// The asyncHandler receives a function and returns a function with three input params
// This code executes a function with the params that are inside fn and does the catch in case of error, in case of success just returns a resolved function
