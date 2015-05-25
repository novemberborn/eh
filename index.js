'use strict';

const _Task = require('./lib/Task');

function misdeed(Ctor) {
  class Task extends _Task {
    constructor(executor) {
      super(Ctor, executor);
    }
  }

  return {
    Task: Task
  };
}

exports = module.exports = misdeed;

exports.Task = misdeed(Promise).Task;
