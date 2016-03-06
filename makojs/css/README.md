# mako-css

> A mako plugin for working with CSS, using npm as a package manager. In addition to bundling the
> CSS together, it also handles copying the assets (such as images and fonts) as well.

[![npm version](https://img.shields.io/npm/v/mako-css.svg)](https://www.npmjs.com/package/mako-css)
[![npm dependencies](https://img.shields.io/david/makojs/css.svg)](https://david-dm.org/makojs/css)
[![npm dev dependencies](https://img.shields.io/david/dev/makojs/css.svg)](https://david-dm.org/makojs/css#info=devDependencies)
[![build status](https://img.shields.io/travis/makojs/css.svg)](https://travis-ci.org/makojs/css)

## Usage

This aims to be the complement to [mako-js](https://github.com/makojs/js), allowing npm packages
with CSS, images, fonts, and other assets to also be consumed just like JS files:

```css
/* local dependency: ./lib/index.css */
@import "./lib";

/* installed dependency: node_modules/my-module/index.css */
@import "my-module";
```

Given the entry CSS files, it will bundle the entire dependency tree into a single output CSS file.
The assets it discovers along the way are also copied, automatically rewriting the URLs when
necessary.

```js
var mako = require('mako');
var text = require('mako-text');
var css = require('mako-css');
var path = require('path');

var entry = path.resolve('./index.css');

mako()
  // read CSS files as text
  .use(text([ 'css' ]))
  // adds the CSS plugin
  .use(css())
  // runs the build
  .build(entry)
  // returns a promise
  .then(function (tree) {
    var file = tree.getFile(entry);
    console.log(file.contents);
    // the combined CSS file
    // the tree also has any linked assets contained
  });
```

## API

### css(options)

Create a new plugin instance, with the following `options` available:

 - `root` the root for the project, paths will be set relative to here (default: `process.cwd()`)
 - `extensions` the list of extensions **in addition to** `.css` to resolve (eg: `.less`, `.sass`)
 - `resolveOptions` additional options to be passed to [resolve](https://www.npmjs.com/package/resolve)

### css.images

An `Array` of extensions for image files that this plugin will interact with. You can add to this
array directly, but for core support of other types, please open an issue.

### css.fonts

An `Array` of extensions for font files that this plugin will interact with. You can add to this
array directly, but for core support of other types, please open an issue.

## Dependencies

 - a read plugin for `css` extensions that has populated `file.contents` with a string

## Effects

During **analyze**, this will parse CSS files for `@import` statements and `url(...)` links, which
will be resolved via [resolve](https://www.npmjs.com/package/resolve).

During **build**, each _entry_ CSS file will have all of it's dependencies bundled into a single
file. Along the way, those dependencies will be _removed_ from the tree, leaving only the output
files behind. The assets, however, will remain in the tree, with their link being moved to the
entry files that use them.
