Promise.allPolyfill = function (promises) {
  if (promises.constructor !== Array) {
    throw Error(
      "Promise.allPolyfill() accepts an array of promises as an argument"
    );
  }

  const totalPromises = promises.length;
  return new Promise((resolve, reject) => {
    const results = Array.from({ length: totalPromises });
    let completedPromises = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (result) => {
          results[index] = result;
          completedPromises++;

          if (completedPromises === totalPromises) {
            resolve(results);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};
