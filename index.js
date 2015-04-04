'use strict';

const util = require('util');

const Task = require('./lib/Task');

function misdeed(Ctor) {
  const Coupled = function(executor) {
    Task.call(this, Ctor, executor);
  };
  util.inherits(Coupled, Task);

  return {
    Task: Coupled
  };
}

exports = module.exports = misdeed;

exports.Task = misdeed(Promise).Task;
