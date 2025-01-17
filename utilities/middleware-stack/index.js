function Middleware() {
  const stashedCallbacks = [];

  function invoke() {
    const cb = stashedCallbacks.shift();
    if (cb instanceof Function) cb.call(this, invoke.bind(this));
  }

  this.use = function (cb) {
    stashedCallbacks.push(cb);
  };

  this.go = function (cb) {
    stashedCallbacks.push(cb);
    invoke.call(this);
  };
}

const middleware = new Middleware();

middleware.use(function (next) {
  const self = this;
  setTimeout(() => {
    self.hook1 = true;
    next();
  }, 1000);
});

middleware.use(function (next) {
  const self = this;
  setTimeout(() => {
    self.hook2 = true;
    next();
  }, 1000);
});

middleware.go(function () {
  console.log(this.hook1);
  console.log(this.hook2);
});
