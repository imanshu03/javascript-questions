## Question: How can you create a polyfill for `Object.assign` in JavaScript?

The `Object.assign` method is a standard way to copy values from one or more source objects to a target object. However, in scenarios where you need to support older environments that do not implement this method, creating a polyfill can be beneficial. Here’s how you can implement a polyfill for `Object.assign`.

### Answer: Polyfill for `Object.assign`

Below is a custom implementation of a polyfill for `Object.assign`, which we will add as a method on the `Object` prototype.

```js
function merge(target, source) {
  const enumerableProperties = Object.keys(source);
  const symbolProperties = Object.getOwnPropertySymbols(source);
  [...enumerableProperties, ...symbolProperties].forEach((key) => {
    target[key] = source[key];
  });
  return target;
}

Object.polyfillAssign = function (target, ...sources) {
  target = Object(target);

  return sources.reduce((acc, source) => {
    acc = merge(acc, source);
    return acc;
  }, target);
};
```

### Explanation

1. **The `merge` Function**:

   - This helper function takes a target object and a source object.
   - It retrieves both enumerable properties (using `Object.keys`) and symbol properties (using `Object.getOwnPropertySymbols`) from the source.
   - It then iterates over all keys and assigns the corresponding values from the source to the target.

2. **The Polyfill Function**:
   - The `polyfillAssign` function starts by ensuring that the target is treated as an object.
   - It uses the `reduce` method to iterate over each source object provided in the arguments.
   - For each source, it calls the `merge` function to copy properties into the accumulator (`acc`), which is initialized with the target.

### Usage Example

Here’s how you can use the polyfilled `Object.polyfillAssign` function:

```js
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3, [Symbol("d")]: 4 };
const mergedObject = Object.polyfillAssign(target, source1, source2);
console.log(mergedObject); // Output: { a: 1, b: 2, c: 3, [Symbol('d')]: 4 }
```
