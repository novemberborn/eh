'use strict';

module.exports = class Task {
  constructor(Ctor, executor) {
    let abortOk, abortError;
    const aborted = new Ctor(function(resolve, reject) {
      abortOk = resolve;
      abortError = reject;
    });

    let handleAbort = null;
    const promise = new Ctor(function(resolve, reject) {
      const ret = executor(resolve, reject);
      if (typeof ret === 'function') {
        handleAbort = ret;
      }
    });

    let settled = false;
    let handleSettled = function() { settled = true; };
    promise.then(handleSettled, handleSettled);

    this.abort = function() {
      if (settled || !handleAbort) {
        abortOk(false);
      } else {
        try {
          handleAbort();
          abortOk(true);
        } catch (error) {
          abortError(error);
        }
      }

      handleAbort = null;
      return aborted;
    };
    this.aborted = aborted;
    this.promise = promise;
  }

  abortAfter(delay) {
    return {
      timer: setTimeout(this.abort.bind(this), delay),
      aborted: this.aborted
    };
  }
};
