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
