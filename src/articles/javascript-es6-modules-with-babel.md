<p class="intro">Every once in a while, a third-party tool or concept is so compelling that it eventually makes its way into the standard. This is what happened with CommonJS and ES2015 (ES6) modules.</p>

While ES2015 module syntax differs from CommonJS, it's clear that they were influenced by, and designed to be compatible with CommonJS. With [Babel](http://babeljs.io/), the `require` statement from CommonJS can be replaced with an `import` as of Node like this:

```js
// CommonJS
var express = require('express');

// ES2015
import express from 'express';
```

<p class="footnote">At the time of this writing, you must use a transpiler such as __Babel__ to use ES2015 modules</p>

Import statements can consume anything from a CommonJS `module.exports` which means all modules written in CommonJS are instantly compatible with ES2015 modules.

There are a few things that make the new syntax compelling over CommonJS, including its ability to do multiple exports and some interesting new patterns with destructuring.


## Multiple Exports

CommonJS only allows for one thing to be exported, which means that if the developer wanted to export multiple functions, they would need to export an object with the functions inside:

```js
// first-example.js
module.exports = {
    foo: function() { ... },
    bar: function() { ... },
    ...
};
```

One thing that make exporting different in ES2015 modules is their ability to `export` multiple things from the same file:

```js
// second-example.js
export function foo() {
    ...
}

export function bar() {
    ...
}
```

However, if we were to `import` the two examples (the first being a CommonJS export and the second being an ES2015 export), we get different results:

```js
import first from 'first-example';
import second from 'second-example';

console.log(first);  // object
console.log(second); // undefined
```

With ES2015 exports, if no `default` is defined and the file has only named exports, then the above import statement will produce `undefined`. However, destructuring can be used to extract the `foo` and `bar` functions into variables:

```js
import { foo, bar } from 'second-example';

foo();
```

Destructuring could have also been used in the first example the same way. But the interesting thing is that you might get nothing (`undefined`) if the module isn't setup for a `default` export.

Alternatively, the asterisk can be used to import everything into an object:

```js
import * as second from 'second-example';

second.foo();
second.bar();
```

<p class="footnote">* The object, `second`, will contain a method of all named exports from the file. In other words, if there were functions in the file that weren't exported, they won't become methods of `second`.</p>


## Default Exports

As already suggested, modules can also designate one of its exports as a `default`. If a file has a `default` export, then the respective `import` wouldn't need to do destructuring or the asterisk solution:

```js
// third-example.js
export function foo() { ... }
export function bar() { ... }
export default function() { ... }
```

```js
import something from 'third-example';
something() // calls the default
```

<p class="footnote">The variable name `something` is just an example. Any name chosen would load the `default` export</p>

In this example, the `import` statement has opted out of importing `foo` and `bar`. However, it is possible to get all three functions with the `import`:

```js
// first way
import * as myModule from 'third-example';

// second way
import defaultFunc { foo, bar } from 'third-example';

// third way
import defaultFunc, * as myModule from 'third-example';
```

__The first way__ creates an object called `myModule` with all three exports as methods. The `default` method has a property name of defualt, ie: `myModule.default()`.

__The second way__ allows us to turn each export into a variable using a combination of destructuring for the named functions and by choosing any variable name for the default.

__The third way__ allows us to create `defaultFunc` as a normal variable and then an object called `myModule` which contains all exports as properties (including the default oddly enough)


## Exporting Expressions

In the examples so far, exporting functions have come in the form of named function declarations. However, function expression syntax can also be used:

```js
export const foo = function() {
    ...
}

export const bar = function() {
    ...
}
```

To my knowledge, there is really no advantage to either one.


## Export Rules

All non-default exports need to be named values with `var`, `let`, or `const`. The `default` export though cannot be named:

```js
// All of these are valid
export const foo = 'abc'
export const bar = {some: 'value'}
export default {some: 'value'}

// All of these are invalid
export const 'abc'
export bar = {some: 'value'}
export default someName = {some: 'value'}
```

## Modules as a function

Many CommonJS modules export a function instead of an object:

```js
module.exports = function() {
    ...
}
```

This allows consumers of those modules to use the module with `require()` like this:

```
var someModule = require('some-module')()
```

This code includes the module function and then calls it immediately which returns the result of that call to `someModule`.

However, with the new ES2015 module syntax, if a module exports a function (even if by default), there would be no way to allow consumers of that module to use a similar syntax:

```js
// Nope, that's not valid at all
import someModule from 'some-module'();
```

You could do the import and function call in two lines though:

```js
import someModuleFactory from 'some-module';
const someModule = someModuleFactory();
```