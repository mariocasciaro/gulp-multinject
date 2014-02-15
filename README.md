[![Build Status](https://secure.travis-ci.org/mariocasciaro/gulp-multinject.png?branch=master)](https://travis-ci.org/mariocasciaro/gulp-multinject) 
[![NPM version](https://badge.fury.io/js/gulp-multinject.png)](http://badge.fury.io/js/gulp-multinject) 
[![Dependency Status](https://gemnasium.com/mariocasciaro/gulp-multinject.png)](https://gemnasium.com/mariocasciaro/gulp-multinject)

# [gulp](https://github.com/wearefractal/gulp)-multinject

> Inject scripts, stylesheets and more into templates and htmls, with support for namespaces.

## Install

Install with [npm](https://npmjs.org/package/gulp-multinject).

```
npm install --save-dev gulp-multinject
```

## Examples

The example below will scan all the `.html` and `.jade` files and will inject the provided scripts and styles.

```js
var gulp = require('gulp');
var gulpMultinject = require('gulp-multinject');

gulp.task('default', function () {
  gulp.src(['assets/**/*.html', 'assets/**/*.jade'])
    .pipe(gulpMultinject([
        'assets/bundle.js',
        'http://example.com/test.js',
        'assets/styles/style.css'
      ],
      'adminNamespace'
    ))
    .pipe(gulp.dest('out/'));
});
```

For `.html` files it will inject between the tags:
```
  <!--INJECT:adminNamespace-->
  <!--END INJECT-->
```

For `.jade` files it will inject between the tags:
```
  //INJECT:adminNamespace
  //END INJECT
```

**At the moment only `.html` and `.jade` files are supported by default, but you can override the 
templates using the `templateMap` option (or submitting a PR) **

## API

### gulpMultinject(injectList, namespace, options)

Create a new gulp-multinject transform stream.

#### Arguments

* `injectList`: `Array`. A list of URLs or files to inject.
* `namespace`: `String`. The namespace to use for the inject tags.
* `Options`: `Object|undefined`. An object containing the following
    * `templateMap`: A map used for resolving the tag and templates to use for the injection. For an example of a template map look into the [default template map](https://github.com/mariocasciaro/gulp-multinject/blob/master/lib/templates.js)
* `base` : `String`. Defaults to `""`. The base directory for the injected files. It will be removed from the provided path before the injection
* `urlPrefix`: `String`. Defaults to `"/"`. A string to prepend to the injected file url.
* `relative`: `Boolean`. Defaults to `false`. If true the injected path will be relative to the file it is injected into.
* `defaultExtension`: `String`. Defaults to `null`. Sometimes if you are injecting some URLs, for example from a CDN, they don't contain an extension, in this case gulp-multinject will use this options to resolve the proper template to use for the injection.


## License

[MIT](http://en.wikipedia.org/wiki/MIT_License) @ Mario Casciaro

-----

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/mariocasciaro/gulp-multinject/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
