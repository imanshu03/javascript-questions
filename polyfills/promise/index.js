const STATES = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

class MyPromise {
  #state;
  #handlers;
  #value;
  constructor(callback) {
    this.#state = STATES.PENDING;
    this.#handlers = [];
    this.#value = undefined;
    try {
      callback(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (error) {
      this.#reject(error);
    }
  }

  #resolve(value) {
    this.#update(STATES.FULFILLED, value);
  }

  #reject(value) {
    this.#update(STATES.REJECTED, value);
  }

  #update(state, value) {
    if (state === STATES.PENDING) return;

    setTimeout(() => {
      if (value instanceof MyPromise) {
        value.then(this.#resolve.bind(this), this.#reject.bind(this));
      } else {
        this.#state = state;
        this.#value = value;
      }
      this.#executeHandlers();
    }, 0);
  }

  #addHandlers(handler) {
    this.#handlers.push(handler);
  }

  #executeHandlers() {
    if (this.#state === STATES.PENDING) return;

    this.#handlers.forEach((handler) => {
      if (this.#state === STATES.FULFILLED) {
        return handler.onSuccess(this.#value);
      }

      return handler.onFailure(this.#value);
    });

    this.#handlers = [];
  }

  then(onSuccess, onFailure) {
    return new MyPromise((resolve, reject) => {
      this.#addHandlers({
        onSuccess: (value) => {
          if (!(onSuccess instanceof Function)) {
            return resolve(value);
          }

          try {
            return resolve(onSuccess(value));
          } catch (error) {
            reject(error);
          }
        },
        onFailure: (value) => {
          if (!(onFailure instanceof Function)) {
            return reject(value);
          }

          try {
            return reject(onFailure(value));
          } catch (error) {
            reject(error);
          }
        },
      });
    });
  }

  catch(onFailure) {
    return this.then(null, onFailure);
  }
}

const promise = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, 1000);
});

function firstFn(value) {
  console.log("first then", value);
  return new MyPromise((resolve) => {
    setTimeout(() => {
      resolve(value * 2);
    }, 1000);
  });
}

function secondFn(value) {
  console.log("nested first then", value);
}

function thirdFn(value) {
  console.log("third then", value);
}

promise.then(firstFn).then(secondFn);

promise.then(thirdFn);
