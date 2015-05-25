# misdeed

Promise-based task management with abortion.

Requires native support for `Promise`, `class`, `const` and `let`.

[Theme song](https://soundcloud.com/buck65/misdeed).

## Installation

```
npm install misdeed
```

## API

### `new misdeed.Task(executor)`

Creates a new task, to be performed by `executor`. Each task has a `.promise`
property containing a promise for when the task is completed. The executor is
called with `resolve` and `reject` arguments to either fulfill or reject this
promise.

The executor may return an abort handler which will be called when the task is
aborted. It'll only be called once, and only if the `.promise` is still pending.
How abortion is handled, if at all, is left to the executor. The executor may
chose to fulfill or reject the promise, or leave it pending.

Note that if the executor calls `resolve()` with another pending promise its
abort handler may still be called until that promise settles. And since promise
state cannot be observed synchronously race conditions may occur where the abort
handler is called after resolving the promise, but before that change could be
observed.

Each task has a `.aborted` property containing a promise for when the task is
aborted. This may never happen, in which case the promise will never settle.

Tasks can be aborted by calling `.abort()`. If the executor did not return an
abort handler, or the `.promise` has already (been observed to have) settled,
the `.aborted` promise is fulfilled with `false`. If the abort handler throws an
error that error is used to reject the `.aborted` promise. Otherwise the
`.aborted` promise is fulfilled with `true`. The `.aborted` promise is returned
when calling `.abort()`.

Note that even if the `.aborted` promise is fulfilled with `true` the `.promise`
may still settle.

### `misdeed.Task#abortAfter(delay)`

Aborts the task after the delay, specified in milliseconds. `setTimeout` is used
internally. Consequently the task may be aborted a little sooner or a little
later than specified.

Returns an object with a `.aborted` property, containing the `.aborted` property
of the task. Additionally the handle returned by `setTimeout` is available on
the returned object as `.timer`. In io.js you could call
[`unref()`](https://iojs.org/api/timers.html#timers_unref) on the timer so it
won't unnecessarily keep the program running. Please read the io.js
documentation carefully, caveat emptor.

### `misdeed(Promise)`

Returns an object with a new `Task` constructor, which uses the value of
`Promise` to construct the `.promise` and `.aborted` promises. This lets you use
Misdeed with non-native Promise implementations.

## License

ISC
