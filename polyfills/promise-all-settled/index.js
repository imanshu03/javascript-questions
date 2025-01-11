Promise.allSettledPolyfill = function (promises) {
  if (promises.constructor !== Array) {
    throw Error(
      "Promise.allSettledPolyfill() accepts an array of promises as an argument"
    );
  }

  const totalPromises = promises.length;
  return new Promise((resolve) => {
    const results = Array.from({ length: totalPromises });
    let completedPromises = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(
          (result) => {
            results[index] = { status: "fulfilled", value: result };
          },
          (error) => {
            results[index] = { status: "rejected", reason: error };
          }
        )
        .finally(() => {
          completedPromises++;

          if (completedPromises === totalPromises) {
            resolve(results);
          }
        });
    });
  });
};
