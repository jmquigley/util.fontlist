# util.fontlist

> Detects the fonts that are available to the browser on the current system

[![build](https://circleci.com/gh/jmquigley/util.fontlist/tree/master.svg?style=shield)](https://circleci.com/gh/jmquigley/util.fontlist/tree/master)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![NPM](https://img.shields.io/npm/v/util.fontlist.svg)](https://www.npmjs.com/package/util.fontlist)


## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as an application dependency:
```
$ yarn add --dev util.fontlist
```

To build the app and run all tests:
```
$ yarn run all
```


## Overview

The `Detector` class can be used to determine if the browser supports the requested font.  It's based on the [algorithm](http://www.lalit.org/lab/javascript-css-font-detect/) created by Lalit Patel.  When the class is instantiated it takes three base fonts (monospace, sans-serif, and serif) and applies them to a base string.  The width and height of this rendered string, for each base, is saved.  The caller then uses the `detect` method to request detection of a font by name.  The base string is then rendered with the font name of the requested font.  The rendered output width and height are compared to the computed base versions from the previous step.  If they differ, then we assume that the browser can render that font.  If they are the same we assume the browser cannot.

Note that this is meant to be used within a browser environment; it needs the DOM and rendering to work correctly.


## Usage

#### Basic Class Usage
```javascript
import {Detector} from 'util.fontlist';

let detector = new Detector();
if (detector.detect('Consolas')) {
	console.log('Consolas is supported');
} else {
	console.log('Consolas is NOT supported');
}
```

#### Convenience Retrieval
A method is provided with the module named `getFontList` that will take a list of font names, internally create the detector, check if each given font exists, and return the list of available fonts.

```javascript
import {getFontList} from 'util.fontlist';

let fontList = getFontList();

// ['Cambria', 'Consolas', ...]

```

By default this function will use the included file `fontlist.json` to get a list of possible fonts.  This can be overridden in the call to `getFontList` to use a custom list:

```javascript
import {getFontList} from 'util.fontlist';

let fontList = getFontList(['Consolas', 'Cambria']);

// ['Cambria', 'Consolas', ...]
```

This will only search for the two fonts given as a parameter instead of the default list.
