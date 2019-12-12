# IHModals [![Build Status](https://travis-ci.org/makeus/ihmodals.svg?branch=master)](https://travis-ci.org/makeus/ihmodals) [![codecov](https://codecov.io/gh/makeus/ihmodals/branch/master/graph/badge.svg)](https://codecov.io/gh/makeus/ihmodals)

IHModals is a lightweight, simple, accessible and tested framework for creating modals. The library has no dependencies and provides its codes unbundled sass and es6 or as bundled css and javascript. 

## Demo

Demo can be checked [Here](https://makeus.github.io/ihmodals/)

## Usage

Include javascript and styling. Javascript can be included by importing 

```javascript
import IHModals from "ihmodals";
```

or by including the built bundle

```html
<script src="/dist/ihmodals.min.js" type="application/javascript"></script>
```

The styling can be included with sass

```scss
@import "dist/ihmodals.scss".
```
The styles can be customized with variables that can be overwritten. Variables can be checked [here](https://github.com/makeus/ihmodals/blob/master/dist/ihmodals.scss).

Built css is also included.

```html
<link href="dist/ihmodals.css" rel="stylesheet">
```

After including the library modal can be initialized with `IHModals` class.

```javascript
const modal = new IHModals(element);
```
where element is the element you want to turn into a modal, for example

```html
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">

    <h2 id="modal-title">Test</h2>
    <p id="modal-description">This is a test modal.</p>
</div>
```

Modal provides necessary methods to open and close modals. Check the [detailed api here](https://makeus.github.io/ihmodals/api).

## Development

This project uses yarn in development. To run unit tests, run
```
yarn test
```
to build, run 
```
yarn build
```

## License

This project is licensed under [MIT license](https://opensource.org/licenses/MIT). 
