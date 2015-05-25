# eh

Promise-based execution with halting.

Requires native support for `Promise`, `class`, `const` and `let`.

## Installation

```
npm install eh
```

## API

### `new eh.Eh(executor)`

Creates a new execution, to be performed by `executor`. Each execution has a
`.promise` property containing a promise for when it is completed. The executor
is called with `resolve` and `reject` arguments to either fulfill or reject this
promise.

The executor may return a function ("halt handler") which will be called when
execution is to be halted. It'll only be called once, and only if the `.promise`
is still pending. How execution is halted, if at all, is left to the executor.
The executor may chose to fulfill or reject the promise, or leave it pending.

Note that if the executor calls `resolve()` with another pending promise its
halt handler may still be called until that promise settles. And since promise
state cannot be observed synchronously race conditions may occur where the halt
handler is called after resolving the promise, but before that change could be
observed.

Each execution has a `.halted` property containing a promise for when it is
halted. This may never happen, in which case the promise will never settle.

Executions can be halted by calling `.halt()`. If the executor did not return a
halt handler, or the `.promise` has already (been observed to have) settled, the
`.halted` promise is fulfilled with `false`. If the halt handler throws an error
that error is used to reject the `.halted` promise. Otherwise the `.halted`
promise is fulfilled with `true`. The `.halted` promise is returned when calling
`.halt()`.

Note that even if the `.halted` promise is fulfilled with `true` the `.promise`
may still settle.

### `eh.Eh#haltAfter(delay)`

Halts the execution after the delay, specified in milliseconds. `setTimeout` is
used internally. Consequently the execution may be halted a little sooner or a
little later than specified.

Returns an object with a `.halted` property, containing the `.halted` property
of the execution. Additionally the handle returned by `setTimeout` is available
on the returned object as `.timer`. In io.js you could call
[`unref()`](https://iojs.org/api/timers.html#timers_unref) on the timer so it
won't unnecessarily keep the program running. This may have performance
implications, please read the io.js documentation carefully.

### `eh(Promise)`

Returns an object with a new `Eh` constructor, which uses the value of `Promise`
to construct the `.promise` and `.halted` promises. This lets you use eh with
non-native Promise implementations.

## License

ISC
