## Question

Implement a `BrowserHistory` class in JavaScript to mimic basic browser history functionality. The class should provide the following methods:

1. `visit(url: string)`:  
   Adds a new URL to the history, clearing any forward history if it exists.

2. `replace(url: string)`:  
   Replaces the current URL in the history without modifying the forward or backward history.

3. `back()`:  
   Moves one step back in the history, if possible.

4. `forward()`:  
   Moves one step forward in the history, if possible.

5. `go(steps: number)`:  
   Moves `steps` backward or forward in the history based on the sign of the `steps` value:

   - Positive: Moves forward.
   - Negative: Moves backward.
   - Throws an error if the argument is not a number.

6. `current()`:  
   Returns the current URL in the history.

---

### Example Usage

```js
const browserHistory = new BrowserHistory("https://example.com");

browserHistory.visit("https://google.com"); // Visits Google
browserHistory.visit("https://youtube.com"); // Visits YouTube

console.log(browserHistory.current()); // "https://youtube.com"

browserHistory.back(); // Moves back to Google
console.log(browserHistory.current()); // "https://google.com"

browserHistory.forward(); // Moves forward to YouTube
console.log(browserHistory.current()); // "https://youtube.com"

browserHistory.replace("https://facebook.com"); // Replaces current URL
console.log(browserHistory.current()); // "https://facebook.com"

browserHistory.go(-2); // Moves back two steps to example.com
console.log(browserHistory.current()); // "https://example.com"

browserHistory.visit("https://twitter.com"); // Visits Twitter, clears forward history
console.log(browserHistory.current()); // "https://twitter.com"
```

## Answer

Here is the implementation of the `BrowserHistory` class:

```js
function BrowserHistory(url = "") {
  this.history = [url];
  this.currentIndex = 0;
}

BrowserHistory.prototype.visit = function (url) {
  const idx = Math.max(0, this.currentIndex);
  this.history = [...this.history.slice(0, idx + 1), url];
  this.currentIndex = this.history.length - 1;
};

BrowserHistory.prototype.replace = function (url) {
  this.history[this.currentIndex] = url;
};

BrowserHistory.prototype.back = function () {
  this.go(-1);
};

BrowserHistory.prototype.forward = function () {
  this.go(1);
};

BrowserHistory.prototype.go = function (steps) {
  if (typeof steps !== "number") {
    throw new Error("Invalid argument. Expected a number");
  }

  if (steps > 0) {
    this.currentIndex = Math.min(
      this.currentIndex + steps,
      this.history.length - 1
    );
  } else {
    this.currentIndex = Math.max(0, this.currentIndex + steps);
  }
};

BrowserHistory.prototype.current = function () {
  return this.history[this.currentIndex];
};
```

### Explanation

- **Constructor**: The `BrowserHistory` constructor initializes the history with the first URL and sets the current index to zero.
- **visit(url)**: This method adds a new URL to the history. If there are any forward entries in the history, they are removed.
- **replace(url)**: This method replaces the current URL with a new one without adding a new entry to the history.
- **back()**: This method moves back one step in the history by calling `go(-1)`.
- **forward()**: This method moves forward one step in the history by calling `go(1)`.
- **go(steps)**: This method allows moving forward or backward by a specified number of steps.
- **current()**: This method returns the current URL from the history.
