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
