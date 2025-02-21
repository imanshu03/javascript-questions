function waitUsingPromises(fn, timeout) {
  return function () {
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        let result, error;
        try {
          result = fn.apply(this, arguments);
        } catch (fnError) {
          error = fnError;
        } finally {
          result ? resolve(result) : reject(error);
          clearTimeout(id);
        }
      }, timeout);
    });
  };
}

function waitUsingCallbacks(fn, timeout, callback) {
  return function () {
    const id = setTimeout(() => {
      let result, error;
      try {
        result = fn.apply(this, arguments);
      } catch (fnError) {
        error = fnError;
      } finally {
        callback(result, error);
        clearTimeout(id);
      }
    }, timeout);
  };
}

function sum(...args) {
  return args.reduce((acc, item) => {
    return acc + item;
  }, 0);
}

const deferredSum1 = waitUsingCallbacks(sum, 2000, (result, error) => {
  console.log("Deferred sum1", {
    result,
    error,
  });
});

const deferredSum2 = waitUsingPromises(sum, 2000);

deferredSum2(2, 3, 4, 5).then(
  (res) => {
    console.log("Deferred sum2", { res });
  },
  (error) => {
    console.error("Deferred sum2", error);
  }
);
deferredSum1(2, 3, 4, 5);
