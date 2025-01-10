## Question: Implement a polyfill for the `Promise.any()` method.

Implement a polyfill for the `Promise.any()` method.

The `Promise.any()` method takes an iterable of promises and returns a promise that resolves as soon as one of the promises fulfills. If none of the promises fulfill, it rejects with an `AggregateError`.

You can read more about [Promise.any on mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

### Requirements:

1. If the input is not iterable, throw a `TypeError`.
2. If the iterable is empty, immediately reject with an `AggregateError`.
3. Resolve with the value of the first fulfilled promise.
4. Reject with an `AggregateError` when all promises are rejected.

---

### Example Usage:

```js
const promises = [
  Promise.reject("Error 1"),
  Promise.resolve(42),
  Promise.reject("Error 2"),
];

Promise.anyPolyfill(promises)
  .then((result) => {
    console.log(result); // Output: 42
  })
  .catch((error) => {
    console.error(error); // This will not execute since one promise fulfilled.
  });

const allRejected = [Promise.reject("Error 1"), Promise.reject("Error 2")];

Promise.anyPolyfill(allRejected)
  .then((result) => {
    console.log(result); // This will not execute since all promises were rejected.
  })
  .catch((error) => {
    console.error(error); // Output: AggregateError: All promises were rejected
  });
```

## Answer

Here is the polyfill for `Promise.any`:

```js
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
```

### Explanation

1. **Input Validation**

   - If the input is not iterable, a `TypeError` is thrown.
   - This ensures the polyfill behaves consistently with the native implementation.

2. **Empty Input**

   - If the array of promises is empty, the returned promise rejects immediately with an `AggregateError`.

3. **Resolving Promises**

   - Each promise in the input is normalized using `Promise.resolve()`.
   - The promise resolves as soon as the first input promise fulfills, passing its value to the resolver.

4. **Rejection Handling**
   - A counter tracks how many promises have rejected.
   - If all promises are rejected, the polyfill rejects with an `AggregateError`.
