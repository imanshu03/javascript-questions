class SequentialQueue {
  #queue;
  constructor() {
    this.#queue = [];
  }

  addTask(task) {
    this.#queue.push(task);
  }

  execute() {
    return new Promise((resolve, reject) => {
      if (this.#queue.length) {
        let result = Promise.resolve();
        this.#queue.forEach((task) => {
          result = result.then(() => {
            let value = task;
            if (value.constructor === Function) {
              value = task();
            }
            return Promise.resolve(value);
          });
        });
        result.then(() => resolve());
      } else {
        reject("No tasks to execute");
      }
    });
  }
}

function fakePromise(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Executed", timeout);
      resolve();
    }, timeout);
  });
}

const queue = new SequentialQueue();

queue.addTask(() => fakePromise(2000));
queue.addTask(() => fakePromise(3000));
