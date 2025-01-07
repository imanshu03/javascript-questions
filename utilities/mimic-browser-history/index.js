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
