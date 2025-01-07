## Question: Implement a polyfill for `Promise.all`

`Promise.all` is a method in JavaScript that accepts an array of promises and returns a single promise. This returned promise:

- **Resolves** when all input promises have resolved, providing an array of results in the same order as the input promises.
- **Rejects** immediately if any input promise rejects, with the reason for that rejection.

You can read more about [Promise.all on mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

### Requirements

1. Accept an array of promises or values.
2. Return a promise that resolves when all the input promises resolve, with an array of their results in the same order.
3. If any promise in the array rejects, the returned promise should immediately reject with the reason of the first rejected promise.

### Example Usage

When all the promises are resolved:

```js
const promise1 = Promise.resolve(10);
const promise2 = new Promise((resolve) => setTimeout(() => resolve(20), 1000));
const promise3 = Promise.resolve(30);

Promise.allPolyfill([promise1, promise2, promise3])
  .then((results) => console.log(results)) // [10, 20, 30]
  .catch((error) => console.error(error));
```

If any promise rejects:

```js
const promise1 = Promise.resolve(10);
const promise2 = Promise.reject("Error");
const promise3 = Promise.resolve(30);

Promise.allPolyfill([promise1, promise2, promise3])
  .then((results) => console.log(results))
  .catch((error) => console.error(error)); // "Error"
```

## Answer

Here is an implementation of the `allPolyfill` function that meets the specified requirements:

```js
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
```

### Explanation:

- The `allPolyfill` function first checks if the input is an array; if not, it throws an error.
- It initializes an array to store results and a counter to track completed promises.
- The function iterates over each promise, resolving it to ensure that non-promise values are handled correctly.
- When a promise resolves, its result is stored in the corresponding index of the results array, and the completed counter is incremented.
- If all promises complete successfully, the results array is resolved.
- If any promise rejects, the polyfill immediately rejects with that error.

This implementation effectively mimics the behavior of `Promise.all`, ensuring proper handling of both resolution and rejection cases.
