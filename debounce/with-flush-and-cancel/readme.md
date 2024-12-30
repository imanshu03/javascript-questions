## [Question: How can you implement a debounce function in JavaScript that includes cancel and flush methods?](https://www.greatfrontend.com/questions/javascript/debounce-ii?format=javascript)

Implement a debounce function which accepts a callback function and a wait duration. Calling debounce() returns a function which has debounce invocations of the callback function following the behavior described above.

Additionally, the debounce function comes with two extra methods:

- cancel() method to cancel pending invocations.
- flush() method to immediately invoke any delayed invocations.

### Answer: Implementation of a Debounce Function with Cancel and Flush Methods

Here’s how you can implement a debounce function that meets these requirements:

```js
function debounce(func, wait) {
  if (!(func instanceof Function)) {
    throw new Error("Expected a function as first argument");
  }
  if (typeof wait !== "number") {
    throw new Error("Expected a number as second argument");
  }

  let timer, stashedCall;

  function cancelTimer() {
    clearTimeout(timer);
    timer = null;
  }

  function invoke() {
    if (timer == null) return;
    cancelTimer();
    func.apply(...stashedCall);
  }

  function debounced(...args) {
    cancelTimer();
    stashedCall = [this, args];
    timer = setTimeout(invoke, wait);
  }

  debounced.cancel = cancelTimer;
  debounced.flush = invoke;

  return debounced;
}
```

### Explanation

1. **Input Validation**:

   - The function begins by validating that the first argument is indeed a function and that the second argument is a number. If either check fails, an error is thrown.

2. **Internal Variables**:

   - Two variables are declared: `timer` to manage the timeout and `stashedCall` to store the context (`this`) and arguments for the callback.

3. **Cancel Timer Function**:

   - The `cancelTimer` function clears any existing timeout and sets the `timer` variable to `null`.

4. **Invoke Function**:

   - The `invoke` function checks if there is an active timer. If so, it cancels the timer and invokes the callback with the stored context and arguments.

5. **Debounced Function**:

   - The main `debounced` function cancels any existing timer, stores the current context and arguments, and sets a new timeout to invoke the callback after the specified wait duration.

6. **Additional Methods**:
   - The `cancel` method allows users to cancel any pending invocations.
   - The `flush` method immediately invokes any delayed calls.

### Usage Example

Here’s how you can use this enhanced debounce function:

```js
let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: Cancel the delayed increment.
debouncedIncrement.cancel();

// t = 100: increment() was not invoked and i is still 0.
```

```js
let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.
// t = 51:
debouncedIncrement.flush(); // i is now 1 because flush causes() the callback to be immediately invoked.

// t = 100: i is already 1. The callback has been called before
// and won't be called again.
```
