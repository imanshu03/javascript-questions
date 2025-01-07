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
