They're becoming quite fashionable right? We see them in all the new articles. And if you're not used to them, it can be difficult to read the docs of your new favorite module that has arrow functions in all the examples.

This post isn't trying to make claims about when or how you should use them. I only hope to explain the new syntax for someone seeing it for the first time. Whether you decide to use them or not, you're going to eventually read code from others that has them. So it's best to understand the mechanics of this new syntax.

Here's a quick example:

```js
const addOne = function(n) {
    return n + 1;
}
```

The above example is the exact same thing now as:

```js
const addOne = (n) => {
    return n + 1;
}
```

Which, in this case, can even be shorter:

```js
const addOne = (n) => n + 1;
```

The second example uses `{ ... }` parenthesis, but since it only has one line of code to return something, the parenthesis can be omitted and the return is implied &mdash; as seen in the third example.


## Single Parameter

When an arrow function has a single parameter, its parenthesis can be omitted:

```js
// Turn this:
someCallBack((results) => {
    ...
})

// Into this:
someCallBack(results => {
    ...
})
```

But if there are no parameters, you must use an open and closed set of parenthesis

```js
someCallBack(() => {
    ...
})
```


## Callbacks

Arrow functions are especially useful for callbacks. Those familiar with JavaScript are familiar with it's lexical scoping, which is nice in many ways, but lends itself to doing things like _this_ trick:

```js
...
var _this = this;
someCallBack(function() {
    _this.accessOuterScope();
})
```

There are several variations instead of "_this" (like "self" or "that"), but the idea is the same. In the callback, we need access to the outer scope's version of `this` which is now different since we're inside the callback.

__With arrow functions__, we get "block scope" and "this" is the same "this" in both places. That means the above code can be written without doing `_this = this`:

```js
...
someCallBack(() => {
    this.accessOuterScope();
})
```


Here's a tweet from Google Engineer, Jeff Archibald to the niceties of arrow functions and how they eliminate the need for `_this = this`:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The great thing about arrow functions is this terrible joke can die <a href="https://t.co/fTAz1EFedN">https://t.co/fTAz1EFedN</a></p>&mdash; Jake Archibald (@jaffathecake) <a href="https://twitter.com/jaffathecake/status/713357424267276288">March 25, 2016</a></blockquote>


## The "Wrapper"

Let's imagine a situation, like in React, where the `onClick` event needs to call `doSomething()`, but also needs to pass arguments to `doSomething()`, like an ID.

This first example actually doesn't work:

```js
const User = React.createClass(function() {
  render: function() {
    return <div onClick={doSomething(this.props.id)}>Some User</div>
  }
})
```

The code will run, but it's technically calling `doSomething()` immediately when the page first loads. To solve this, some devs reference a wrapper function:


```js
const User = React.createClass(function() {

  render: function() {
    return <div onClick={this.onClick}>Some User</div>
  },

  onClick: function() {
    doSomething(this.props.userId);
  }

})
```
<p class="footnote">
    The lack of parenthesis on `this.onClick` means it's just a reference to the function, and not actually calling it
</p>

The `onClick()` function now serves as somewhat of a "wrapper" for `doSomething()`.

With arrow functions, one can make inline wrappers like this:

```js
const User = React.createClass(function() {
  render: function() {
    return <div onClick={() => doSomething(this.props.userId)}>Some User</div>
  }
})
```

Just to show another way, we could also use `.bind()` which would not require any wrapped functions (arrow function or otherwise):

```js
const User = React.createClass(function() {
  render: function() {
    return <div onClick={doSomething.bind(null, this.props.userId)}>Some User</div>
  }
})
```

## Browser Support

If you need browser support beyond the recent versions of [Chrome and Firefox](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Browser_compatibility), I would suggest using the [Babel transpiler](https://babeljs.io/) to convert your ES6 code that you write, into ES5 code for the browser.