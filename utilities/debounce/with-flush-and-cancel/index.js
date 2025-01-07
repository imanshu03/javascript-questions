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
