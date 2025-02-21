const generateID = () => {
  const characters = "ABCDEF123456";
  let id = "";
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * characters.length);
    id += characters[idx];
  }
  return id;
};

class Events {
  constructor() {
    this.events = new Map();
  }

  addCallbackToMap(topic, callback, isOnce) {
    const fnID = generateID();

    if (!this.events.has(topic)) {
      this.events.set(topic, new Map());
    }

    this.events.get(topic).set(fnID, {
      callback,
      isOnce,
    });

    return fnID;
  }

  subscribe(topic, callback) {
    const fnID = this.addCallbackToMap.call(this, topic, callback, false);

    return {
      remove: () => {
        delete this.events.get(topic)?.[fnID];
      },
    };
  }

  subscribeOnce(topic, callback) {
    this.addCallbackToMap.call(this, topic, callback, true);
  }

  executeCallbacks(topic, callbacks, payload) {
    [...callbacks.entries()].forEach(([fnID, { isOnce, callback }]) => {
      setTimeout(() => {
        callback(payload);
      }, 0);
      //   callback(payload);
      if (isOnce) delete this.events.get(topic)?.[fnID];
    });
  }

  publish(topic, payload) {
    if (this.events.has(topic)) {
      this.executeCallbacks.call(this, topic, this.events.get(topic), payload);
    }
  }

  publishAll(payload) {
    if (this.events.size !== 0) {
      [...this.events.entries()].forEach(([topic, callbackMap]) => {
        this.executeCallbacks.call(this, topic, callbackMap, payload);
      });
    }
  }

  subscribeOnceAsync(topic) {
    let promiseResolve;
    const dummyPromise = new Promise((resolve) => {
      promiseResolve = resolve;
    });
    this.addCallbackToMap.call(this, topic, promiseResolve, true);
    return dummyPromise;
  }
}

const events = new Events();

// const sub1 = events.subscribe("new-user", function (payload) {
//   console.log(`Hello, ${payload}!`);
// });

// events.publish("new-user", "Tathagat");

// const sub2 = events.subscribe("new-user", function (payload) {
//   console.log(`Welcome to our org, ${payload}!`);
// });

// events.publish("new-user", "Imanshu");

// sub1.remove();

// events.publish("new-user", "Tripurari");

// events.subscribeOnce("new-user", function (payload) {
//   console.log(`Webdev core, ${payload}!`);
// });

// events.publish("new-user", "Amal");
// events.publish("new-user", "Nikunj");

// sub2.remove();

events.subscribeOnceAsync("new-user").then((payload) => {
  console.log("Async payload", payload);
});

const sub3 = events.subscribe("new-user", function (payload) {
  console.log("Sync payload", payload);
});

events.publish("new-user", "Naidu");
