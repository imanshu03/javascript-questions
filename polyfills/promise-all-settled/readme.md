## Question: Implement a polyfill for the `Promise.allSettled()` method.

The `Promise.allSettled()` method takes an array of promises and returns a promise that resolves when all the input promises have settled (either fulfilled or rejected). The resolved value is an array of objects describing the outcome of each promise.

You can read more about [Promise.allSettled on mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

### Requirements:

- If the argument passed is not an array, throw an error.
- For each promise:
  - If fulfilled, the result object should have the format `{ status: "fulfilled", value: <value> }`.
  - If rejected, the result object should have the format `{ status: "rejected", reason: <reason> }`.

---

### Example Usage

```js
const promises = [
  Promise.resolve(42),
  Promise.reject("Error occurred"),
  Promise.resolve("Success"),
];

Promise.allSettledPolyfill(promises).then((results) => {
  console.log(results);
});
```

Output:

```js
[
  { status: "fulfilled", value: 42 },
  { status: "rejected", reason: "Error occurred" },
  { status: "fulfilled", value: "Success" },
];
```

## Answer

```js
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
```

### Explanation

1. **Input Validation**:

- If the input is not an array, an error is thrown to ensure correct usage.

2. **Handling Promises**:

- Each promise in the array is passed through Promise.resolve() to normalize non-promise values.
- The .then() and .catch() handlers are used to process fulfilled and rejected promises, respectively.

3. **Tracking Results**:

- A results array stores the outcome of each promise in the specified format.
- The index ensures that the results are added in the same order as the input promises.

4. **Completion Check**:

- A completedPromises counter tracks how many promises have settled.
- When all promises are settled, the resolve function is called with the results array.
