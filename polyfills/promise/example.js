class MyPromise {
  constructor(callback) {
    this.handlers = [];

    callback(this.resolve.bind(this));
  }

  resolve(value) {
    this.handlers.forEach((handler) => {
      setTimeout(() => {
        if (value instanceof MyPromise) {
          value.then((res) => handler(res));
        } else {
          handler(value);
        }
      }, 0);
    });
    this.handlers = [];
  }

  then(callback) {
    return new MyPromise((resolve) => {
      this.handlers.push((value) => {
        resolve(callback(value));
      });
    });
  }
}

const p = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});

p.then((value) => {
  console.log("First", value);
  return new MyPromise((resolve) => {
    setTimeout(() => {
      resolve(value * 10);
    }, 2000);
  });
}).then((value) => {
  console.log("Second", value);
});

p.then((value) => {
  console.log("Third", value);
});
