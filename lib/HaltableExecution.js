'use strict';

module.exports = class HaltableExecution {
  constructor(PromiseCtor, executor) {
    let haltOk, haltError;
    const halted = new PromiseCtor(function(resolve, reject) {
      haltOk = resolve;
      haltError = reject;
    });

    let handleHalt = null;
    const promise = new PromiseCtor(function(resolve, reject) {
      const ret = executor(resolve, reject);
      if (typeof ret === 'function') {
        handleHalt = ret;
      }
    });

    let settled = false;
    let handleSettled = function() { settled = true; };
    promise.then(handleSettled, handleSettled);

    this.halt = function() {
      if (settled || !handleHalt) {
        haltOk(false);
      } else {
        try {
          handleHalt();
          haltOk(true);
        } catch (error) {
          haltError(error);
        }
      }

      handleHalt = null;
      return halted;
    };
    this.halted = halted;
    this.promise = promise;
  }

  haltAfter(delay) {
    return {
      timer: setTimeout(this.halt.bind(this), delay),
      halted: this.halted
    };
  }
};
