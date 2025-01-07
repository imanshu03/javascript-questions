## Question

You are required to implement a `TaskManager` that manages the execution of tasks with a specified concurrency limit. The `TaskManager` should allow you to add tasks that can be executed in parallel, but only up to the specified concurrency limit. If there are more tasks than the concurrency limit, the additional tasks should be queued and executed once the currently running tasks finish.

### Requirements:

1. Implement a `TaskManager` class that accepts a `concurrency` parameter during instantiation.
2. The `TaskManager` should have a method `addTask(task)` to add a new task.
3. If the number of currently running tasks is less than the concurrency limit, the task should be executed immediately.
4. If the number of currently running tasks equals or exceeds the concurrency limit, the task should be added to a queue (pending tasks).
5. Once a running task is completed, any pending tasks should be executed in the order they were added.

### Task Signature:

Each task is expected to be a function that returns a Promise.

### Usage Example

```js
const taskManager = new TaskManager(2);

const createTask = (id, delay) => () =>
  new Promise((resolve) => {
    console.log(`Task ${id} started`);
    setTimeout(() => {
      console.log(`Task ${id} completed`);
      resolve();
    }, delay);
  });

taskManager.addTask(createTask(1, 3000)); // Runs immediately
taskManager.addTask(createTask(2, 2000)); // Runs immediately
taskManager.addTask(createTask(3, 1000)); // Queued
taskManager.addTask(createTask(4, 1500)); // Queued
```

Expected output:

```js
Task 1 started
Task 2 started
Task 2 completed
Task 3 started
Task 1 completed
Task 4 started
Task 3 completed
Task 4 completed
```

## Answer

Here is an implementation of the `TaskManager` class that meets the specified requirements:

```js
function TaskManager(concurrency) {
  this.concurrency = concurrency;
  this.pendingTasks = [];
  this.numberOfRunningTasks = 0;
}

TaskManager.prototype.run = function (task) {
  this.numberOfRunningTasks += 1;
  task()
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      this.numberOfRunningTasks -= 1;
      this.checkAndExecutePendingTask();
    });
};

TaskManager.prototype.checkAndExecutePendingTask = function () {
  if (
    this.pendingTasks.length === 0 ||
    this.numberOfRunningTasks >= this.concurrency
  ) {
    return;
  }

  const task = this.pendingTasks.shift();
  this.run(task);
};

TaskManager.prototype.addTask = function (task) {
  if (this.numberOfRunningTasks >= this.concurrency) {
    this.pendingTasks.push(task);
    return;
  }

  this.run(task);
};
```

### Explanation:

- The `TaskManager` constructor initializes the concurrency limit, an array for pending tasks, and a counter for currently running tasks.
- The `run` method executes a given task and manages the running tasks counter and pending tasks.
- The `checkAndExecutePendingTask` method checks if there are any pending tasks to execute when a running task finishes.
- The `addTask` method adds a new task either for immediate execution or queues it if the concurrency limit is reached.

This implementation ensures that tasks are executed according to the specified concurrency limit while efficiently managing any pending tasks.
