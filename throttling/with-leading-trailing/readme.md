## Question: Implement an enhanced `throttle` function in JavaScript that accepts an options parameter to control leading and trailing invocations

Enhance the standard [**throttle function**](../basic) to support configurable options for controlling the behavior of function execution at the start and end of the throttling interval. The enhanced `throttle` function should:

1. Accept a third parameter, `option`, with two properties:

   - `leading`: A boolean indicating whether to execute the function at the start of the interval.
   - `trailing`: A boolean indicating whether to execute the function at the end of the interval.

2. Ensure the function adheres to the following rules:

   - If `leading` is `true`, the function executes immediately when called.
   - If `trailing` is `true`, the function executes one last time after the interval, using the most recent invocation's context and arguments.

### Example Usage

1. Default Behavior: `leading: true, trailing: true`

```js
const log = (...args) => console.log(...args);

const throttledLog = throttle(log, 2000, { leading: true, trailing: true });

throttledLog("Call 1"); // Executes immediately (leading)
throttledLog("Call 2"); // Stashed, executed after 2 seconds (trailing)
```

Output:

```js
Call 1
Call 2
```

2. `leading: false, trailing: true`

```js
const throttledLog = throttle(log, 2000, { leading: false, trailing: true });

throttledLog("Call 1"); // No immediate execution
throttledLog("Call 2"); // Executed after 2 seconds (trailing)
throttledLog("Call 3"); // Replaces Call 2, executed after 2 seconds
```

Output:

```js
Call 3
```

3. `leading: true, trailing: false`

```js
const throttledLog = throttle(log, 2000, { leading: true, trailing: false });

throttledLog("Call 1"); // Executes immediately (leading)
throttledLog("Call 2"); // Ignored during the interval
throttledLog("Call 3"); // Ignored during the interval
```

Output:

```js
Call 1
```

4. `leading: false, trailing: false`

```js
const throttledLog = throttle(log, 2000, { leading: false, trailing: false });

throttledLog("Call 1"); // Ignored
throttledLog("Call 2"); // Ignored
throttledLog("Call 3"); // Ignored
```

Output:

```js
(No output)
```

5. Complex Use Case

```js
const log = (...args) => console.log(...args);

const throttledLog = throttle(log, 3000, { leading: true, trailing: true });

throttledLog("Event 1"); // Executes immediately (leading)
setTimeout(() => throttledLog("Event 2"), 1000); // Stashed
setTimeout(() => throttledLog("Event 3"), 2000); // Replaces Event 2
setTimeout(() => throttledLog("Event 4"), 4000); // Executes after interval
```

Output:

```js
Event 1
Event 3
Event 4
```

## Answer

Here is the implementation of the enhanced **throttle** function:

```js
function throttle(func, wait, option = { leading: true, trailing: true }) {
  let timer = null,
    stashedInvocation = null;

  function timeUp() {
    timer = null;
    if (stashedInvocation && option.trailing) {
      func.apply(this, ...stashedInvocation);
      timer = setTimeout(timeUp, wait);
      stashedInvocation = null;
    }
  }

  return function (...args) {
    if (timer == null) {
      if (option.leading) {
        func.apply(this, args);
      }
      timer = setTimeout(timeUp, wait);
    } else {
      if (option.trailing) {
        stashedInvocation = [this, args];
      }
    }
  };
}
```

### How It Works

1. **Parameters**:

   - `func`: The function to throttle.
   - `wait`: The time in milliseconds to wait before allowing another invocation.
   - `option`: An object with two properties:
     - `leading`: A boolean that determines if the function should be invoked immediately.
     - `trailing`: A boolean that determines if the function should be invoked after the delay.

2. **Variables**:

   - `timer`: Keeps track of the current timeout.
   - `stashedInvocation`: Stores the latest call (context and arguments) made during the throttling interval.

3. **Inner Function `timeUp`**:

   - Resets the timer and checks if there are any stashed invocations.
   - If trailing is enabled and there are stashed invocations, it calls the original function with those arguments.

4. **Returned Function**:
   - Checks if the timer is active. If not and leading is enabled, it calls the original function immediately.
   - If the timer is active and trailing is enabled, it stashes the current invocation for later execution.
