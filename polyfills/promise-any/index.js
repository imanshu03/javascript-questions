Promise.anyPolyfill = function (promises) {
  if (promises == null || typeof promises[Symbol.iterator] !== "function") {
    throw Error(`TypeError: ${typeof promises} is not iterable`);
  }
  promises = [...promises];
  const rejectionError = "AggregateError: All promises were rejected";
  if (promises.length === 0) {
    return Promise.reject(rejectionError);
  }

  const totalPromises = promises.length;
  return new Promise((resolve, reject) => {
    let completedPromises = 0;

    promises.forEach((promise) => {
      Promise.resolve(promise).then(resolve, () => {
        completedPromises += 1;
        if (completedPromises === totalPromises) {
          reject(rejectionError);
        }
      });
    });
  });
};
