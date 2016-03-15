<p class="intro">Every once in a while, a third-party tool or concept is so compelling that it eventually makes its way into the standard. This is what happened with CommonJS and ES2015 (ES6) modules.</p>

While ES2015 module syntax differs from CommonJS, it's clear that it was influenced by, and designed to be compatible with CommonJS.

From the `import` standpoint, here's how the new ES2015 syntax looks in comparison:

```js
// CommonJS
var express = require('express');

// ES2015
import express from 'express';
```

<p class="footnote">At the time of this writing, Node does not support ES2015 modules. You must use a transpiler such as [Babel](http://babeljs.io/) to use them. If you want to use this syntax for the browser, use Babel with a bundler like Webpack or Browserify</p>

Import statements can consume anything from a CommonJS `module.exports` which means all modules written in CommonJS are instantly compatible with ES2015 modules.

There are a few things that make the new syntax compelling over CommonJS, including its ability to do multiple exports and some interesting new patterns with destructuring.

This article doesn't focus so much on teaching why one would want to use modules, but rather as a contrast between CommonJS and ES2015 modules.


## Multiple Exports

CommonJS only allows for one thing to be exported, which means that if the developer wanted to export multiple functions, they would need to export an object methods instead:

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

However, if we were to `import` the two examples (the first being a CommonJS export and the second being an ES2015 export), we would get different results:

```js
import first from 'first-example';
import second from 'second-example';

console.log(first);  // object
console.log(second); // undefined
```

In the `second-example.js` file, there are multiple exports but none are the "default" export. Instead it has two "named" exports. This causes an `undefined` to be returned to our variable name with Babel's interpretation of ES2015 modules.

To import the ES2015 module, we can use [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), another new ES2015 feature. Destructuring can be used to extract the named `foo` and `bar` functions into variables:

```js
import { foo, bar } from 'second-example';

foo();
```

<p class="footnote">
    Destructuring could have also been used for the `first-example.js` file to extract the object's methods just as we did with the `second-example.js` file.
</p>

Alternatively, the asterisk can be used to import all the named functions into an object:

```js
import * as second from 'second-example';

second.foo();
second.bar();
```

In this case, the object, `second`, will contain methods for each named exports from the file. If there were functions in the file that weren't exported, they won't become methods of `second`.


## Default Exports

As already suggested, a module can also designate one of its exports as a `default`. If a file has a `default` export, then the respective `import` wouldn't need to do destructuring or the asterisk syntax:

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

The variable name `something` is just an example. Any variable name could have been chosen to load the `default` export. The main point though is that with this `import` syntax, we will get the `default` of the module, and nothing else.

So what if we want to `import` the default along with `foo` and `bar`? It is possible to get all three functions with the `import`:

```js
// first way
import * as myModule from 'third-example';

// second way
import defaultFunc, { foo, bar } from 'third-example';

// third way
import defaultFunc, * as myModule from 'third-example';
```

__The first way__ creates an object called `myModule` with all three exports as methods. The `default` export becomes a property name of "defualt", ie: `myModule.default()`.

__The second way__ creates three variables: `defaultFunc`, `foo`, and `bar` using a hybrid of the destructuring way and the default way.

__The third way__ allows us to create `defaultFunc` as a normal variable and then an object called `myModule` which contains all exports as properties (including the default oddly enough)


## Exporting Expressions

In the examples so far, exporting functions have come in the form of named function declarations. However, function expression syntax can also be used:

```js
// Function Declarations
export function foo() {
    ...
}

// Function Expressions
export const bar = function() {
    ...
}
```

While ordinarily the difference between function declarations and expressions is a matter of [hoisting](http://www.w3schools.com/js/js_hoisting.asp), I don't believe there are any real differences between the two when it comes to modules.


## Other types of exports

Modules can also export things other than functions. But all non-default exports need to be named values with `var`, `let`, or `const`. The `default` export though cannot be named:

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

```js
var someModule = require('some-module')()
```

<p class="footnote">Notice the extra set of parenthesis at the end.</p>

This code includes the module (which is a function instead of an object) and then calls the function immediately. Then, it's the result of that function call which is returned to `someModule`.

Some have wondered how these types of modules will continue to be compatible with ES2015 since the new `import` syntax cannot allow a returned function to be called immediately in a similar way:

```js
// Nope, that's not valid at all
import someModule from 'some-module'();
```

However, with the new ES2015 module syntax, if a module exports a function (even if by default), You could do the `import` in one line and then call the function in the next:

```js
import someModuleFactory from 'some-module';
const someModule = someModuleFactory();
```

It's not quite as elegant, but it works.

## Summary

For more information, read Mozilla's documentation on [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)