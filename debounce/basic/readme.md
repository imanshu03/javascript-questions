## Question: What is a debounce function, and how can you implement it in JavaScript?

Debouncing is a programming technique used to limit the rate at which a function can fire. It ensures that a function is not called too frequently, which can be particularly useful in scenarios like handling user input events (e.g., resizing, scrolling, or typing). The goal is to delay the execution of the function until a certain amount of time has passed since the last time it was invoked.

### Usage Example

Here’s an example of how you might use the debounce function:

```js
const handleResize = () => {
  console.log("Window resized!");
};

const debouncedResize = debounce(handleResize, 300);
window.addEventListener("resize", debouncedResize);
```

In this example, the `handleResize` function will only be called once every 300 milliseconds while resizing the window, regardless of how many times the resize event fires.

### Answer: Implementation of a Debounce Function

Here’s how you can implement a debounce function in JavaScript:

```js
function debounce(func, wait) {
  if (!(func instanceof Function)) {
    throw new Error("Expected a function as first argument");
  }
  if (typeof wait !== "number") {
    throw new Error("Expected a number as second argument");
  }

  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
```

### Explanation

1. **Input Validation**:

   - The function first checks if the first argument (`func`) is indeed a function. If not, it throws an error.
   - It also checks if the second argument (`wait`) is a number. If it isn’t, it throws another error.

2. **Timer Variable**:

   - A variable `timer` is declared to keep track of the timeout.

3. **Returned Function**:
   - The debounce function returns another function that takes any number of arguments (`...args`).
   - Inside this returned function:
     - `clearTimeout(timer)` is called to reset the timer each time the function is invoked.
     - `setTimeout` is used to delay the execution of `func` by the specified `wait` time.
     - When the timer expires, `func` is called with the original context and arguments using `func.apply(this, args)`.

### Conclusion

The debounce function is a powerful tool for optimizing performance in JavaScript applications by reducing the frequency of function calls. This implementation provides a clear and effective way to achieve debouncing, making it useful for various scenarios such as event handling and API calls.

Feel free to experiment with this code and adapt it to fit your specific needs!
