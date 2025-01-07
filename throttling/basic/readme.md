## Question: What is a throttling function in JavaScript, and how can we implement it?

Throttling is a programming technique used to limit the number of times a function can be executed over a specified period. This is particularly useful in scenarios like handling scroll events, resizing windows, or any other event that may fire frequently. By using throttling, we can improve performance and prevent excessive function calls.

### Requirements:

1. Write a `throttle` function that accepts:
   - `func`: The function to be throttled.
   - `wait`: The time interval (in milliseconds) to wait before allowing the next invocation of `func`.
2. Ensure that if calls are made during the throttling interval, the latest call is stashed and executed once the interval is over.

### Example Usage:

```js
const log = (...args) => console.log(...args);

const throttledLog = throttle(log, 2000);

throttledLog("Call 1"); // Executes immediately
throttledLog("Call 2"); // Stashed, executed after 2 seconds
throttledLog("Call 3"); // Replaces Call 2, executed after 2 seconds
```

Expected Output:

```js
Call 1
Call 3
```

## Answer

Here’s an implementation of a throttle function in JavaScript:

```js
function throttle(func, wait) {
  let timer = null,
    stashedInvocation = null;

  function timeUp() {
    timer = null;
    if (stashedInvocation) {
      func.apply(...stashedInvocation);
      timer = setTimeout(timeUp, wait);
      stashedInvocation = null;
    }
  }

  return function (...args) {
    if (timer == null) {
      func.apply(this, args);
      timer = setTimeout(timeUp, wait);
    } else {
      stashedInvocation = [this, args];
    }
  };
}
```

### Explanation:

1. **Parameters**:

   - `func`: The function you want to throttle.
   - `wait`: The time in milliseconds to wait before allowing the next invocation.

2. **Variables**:

   - `timer`: Keeps track of the current timeout.
   - `stashedInvocation`: Stores the latest call (context and arguments) made during the throttling interval.

3. **Inner Function `timeUp`**:

   - Resets the timer and checks if there are any stashed invocations.
   - If there are, it calls the original function with those arguments and sets a new timeout.

4. **Returned Function**:
   - Checks if the timer is active. If not, it calls the original function immediately and starts the timer.
   - If the timer is active, it stashes the current invocation for later execution.
