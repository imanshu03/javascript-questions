const fakePromise = (value, timeout = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value + 10), timeout);
  });
};
const fakeSyncCall = (value) => value + 10;

const batch = [fakePromise, fakeSyncCall, fakePromise, fakePromise];

function processBatch(data, initialValue) {
  if (!Array.isArray(data)) throw new Error(`data is not iterable`);
  if (initialValue === undefined)
    throw new Error("initialValue cannot be undefined");

  return data.reduce((acc, process) => {
    if (!(process instanceof Function)) {
      throw new Error("process is not a function");
    }
    return acc.then((res) => process(res));
  }, Promise.resolve(initialValue));
}

// Promise.resolve(initialValue).then(res => fakePromise(res)).then((res) => fakePromise(res)).then((res) => fakePromise(res));

processBatch(batch, 20).then((result) =>
  console.log({
    result,
  })
);

function processBatch2(data) {
  if (!Array.isArray(data)) throw new Error(`data is not iterable`);

  return function (initialValue) {
    if (initialValue === undefined)
      throw new Error("initialValue cannot be undefined");
    return data.reduce((acc, process) => {
      if (!(process instanceof Function)) {
        throw new Error("process is not a function");
      }
      return acc.then((res) => process(res));
    }, Promise.resolve(initialValue));
  };
}
