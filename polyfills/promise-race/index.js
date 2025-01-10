Promise.racePolyfill = function (promises) {
  if (promises == null || typeof promises[Symbol.iterator] !== "function") {
    throw Error(`TypeError: ${typeof promises} is not iterable`);
  }

  promises = [...promises];

  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise).then(resolve, reject);
    });
  });
};
