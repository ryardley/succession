# Succession
Succession is a tool for creating dynamic function chains. It is similar to `lodash`'s `flow`
or `ramda`'s `pipe` with one important exception, namely that you can *force functions to run
at the very start or very end of the chain no matter where the handler is added.*

## Usage

```js

import chain from 'succession';

const plusTwo = n => n + 2;
const timesTwo = n => n * 2;
const divideTwo = n => n / 2;

const calculate = chain(
  plusTwo,
  timesTwo,
  divideTwo,
  plusTwo
)
// ((((10 + 2) * 2) / 2) + 2) = 14
console.log(calculate(10)); // 14

```

### Nesting

Nesting also works as expected

```js
// ...
const calculate = chain(
  plusTwo,
  chain(
    timesTwo,
    divideTwo
  ),
  plusTwo
)

console.log(calculate(10)); // 14
```

### Force functions to the start or end

Here is the important part: **You can then force a handler to the end of the chain from the sub chain.**

```js
// ...
const addUnits = n => `${n} seconds`;

const innerChain = chain(
  timesTwo,
  divideTwo
).last(addUnits);

const calculate = chain(
  plusTwo,
  innerChain,
  plusTwo
)

console.log(calculate(10)); // "14 seconds"
```

Or ensure a handler starts the chain

```js
const calculate = chain(
  plusTwo,
  chain(
    timesTwo,
    divideTwo
  ).first(() => 10),
  plusTwo
)

console.log(calculate('foo')); // 14
```

## So why would you want to do this?

Here is an example of a chain that is configuring an express server.

```js
import express from 'express';
import path from 'path';
import chain from 'succession';

const initApp = (app) => app || express();

const serveStaticFiles = (app) => {
  app.use('/static', express.static(path.join(__dirname, 'static')));
  return app;
}

const launchServer = (app) => {
  app.listen(5000, () => {
    console.log('Listening on 5000');
  });
  return app;
}

const expressChain = chain(
  serveStaticFiles
)
.first(initApp)
.last(launchServer);

export { expressChain as express };
```


Now it is possible for another module to take this chain and add its own express
configuration dynamically without having any dependency on the module providing
the webserver.

```js
import chain from 'succession';

import {express} from './webserver';
import {expressRouter} from './router';

chain(express, expressRouter);
```
