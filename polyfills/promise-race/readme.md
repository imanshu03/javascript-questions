## Question: Implement a polyfill for the `Promise.race()` method.

The `Promise.race()` method takes an iterable of promises and returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects.

You can read more about [Promise.race on mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

### Requirements:

1. If the input is not iterable, throw a `TypeError`.
2. Resolve or reject immediately with the result of the first resolved or rejected promise.
3. Ensure consistency with the behavior of the native `Promise.race`.

---

### Example Usage

First Rejection:

```js
const promises = [
  new Promise((resolve) => setTimeout(() => resolve("Resolved 1"), 1000)),
  new Promise((resolve) => setTimeout(() => resolve("Resolved 2"), 500)),
  new Promise((_, reject) => setTimeout(() => reject("Rejected 1"), 200)),
];

Promise.racePolyfill(promises)
  .then((result) => {
    console.log(result); // This won't be called
  })
  .catch((error) => {
    console.error(error); // Output: Rejected 1
  });
```

First Resolution:

```js
const promises = [
  new Promise((_, reject) => setTimeout(() => reject("Rejected 1"), 500)),
  new Promise((resolve) => setTimeout(() => resolve("Resolved 2"), 1000)),
  new Promise((resolve) => setTimeout(() => resolve("Resolved 1"), 200)),
];

Promise.racePolyfill(promises)
  .then((result) => {
    console.log(result); // Output: Resolved 1
  })
  .catch((error) => {
    console.error(error); // This won't be called
  });
```

## Answer

Here is the implementation of the polyfill:

```js
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
```

### Explanation

1. **Input Validation**  
   If the input is not iterable, the polyfill throws a `TypeError`.  
   This ensures the function behaves like the native `Promise.race()`.

2. **Immediate Resolution or Rejection**  
   The first promise to either resolve or reject determines the outcome of the returned promise.

3. **Promise Normalization**  
   Non-promise values in the iterable are converted to promises using `Promise.resolve()` for consistent handling.

4. **Behavior**  
   The polyfill replicates the native behavior of `Promise.race`, resolving or rejecting based on the fastest-settling promise.
