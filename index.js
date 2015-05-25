'use strict';

const HaltableExecution = require('./lib/HaltableExecution');

function eh(PromiseCtor) {
  return {
    Eh: class extends HaltableExecution {
      constructor(executor) {
        super(PromiseCtor, executor);
      }
    }
  };
}

exports = module.exports = eh;

exports.Eh = eh(Promise).Eh;
