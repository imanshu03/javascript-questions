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
