<p align="center">
  <img src="https://i.imgur.com/JaXEFNp.png" width="300" height="300" alt="unfetch">
  <br>
  <a href="https://www.npmjs.org/package/unfetch"><img src="https://img.shields.io/npm/v/unfetch.svg?style=flat" alt="npm"></a> <a href="https://travis-ci.org/developit/unfetch"><img src="https://travis-ci.org/developit/unfetch.svg?branch=master" alt="travis"></a>
</p>

# unfetch

> Tiny 500b fetch "barely-polyfill"

-   **Tiny:** weighs about **500 bytes** gzipped
-   **Minimal:** just `fetch()` with headers and text/json/xml responses
-   **Familiar:** a subset of the full API
-   **Supported:** supports IE8+ (<abbr title="Bring Your Own Promises">BYOP</abbr>)
-   **Standalone:** one function, no dependencies

> 🤔 **What's Missing?**
>
> -   Uses simple Arrays instead of Iterables, since Arrays _are_ iterables
> -   No streaming, just Promisifies existing XMLHttpRequest response bodies
> -   Bare-bones `.blob()` implementation - just proxies `xhr.response`

* * *

## Table of Contents

-   [Install](#install)
-   [Usage](#usage)
-   [Examples & Demos](#examples--demos)
-   [API](#api)
-   [Contribute](#contribute)
-   [License](#license)

* * *

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save unfetch
```

Then with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.js.org/), use as you would anything else:

```javascript
// using ES6 modules
import fetch from 'unfetch'

// using CommonJS modules
var fetch = require('unfetch')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/unfetch/dist/unfetch.umd.js"></script>
```

This exposes a `fetch` global if not already present.

* * *

## Usage

```js
import fetch from 'unfetch'

fetch('/foo.json')
  .then( r => r.json() )
  .then( data => {
    console.log(data)
  })
```

## Examples & Demos

```js
// simple GET request:
fetch('/foo')
  .then( r => r.text() )
  .then( txt => console.log(txt) )


// complex POST request with JSON, headers:
fetch('/bear', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ hungry: true })
}).then( r => {
  open(r.headers.get('location'));
  return r.json();
})
```

* * *

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](../../issues).
If don't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone https://github.com/<your-username>/unfetch`
-   Navigate to the newly cloned directory: `cd unfetch`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](LICENSE.md) © [Jason Miller](https://jasonformat.com/)
