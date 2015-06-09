# [gulp-recipe](https://github.com/PGSSoft/gulp-recipe-loader)-pipemin-build [![Dependency Status][depstat-image]][depstat-url]
[![NPM][npm-image]][npm-url]

Container for fast project compilation with hooks, based on [gulp-pipemin](https://github.com/Frizi/gulp-pipemin).

## Tasks
### build
> deps: clean:dist

Build whole project into dist directory.

### package
> deps: build

Make zip package file ready for deployment.

### clean:dist

Delete dist directory and its contents.

## Configuration
### Recipe specific

### [Sources](https://github.com/PGSSoft/gulp-recipe-loader#sources-configuration-syntax)
#### sources.index
> mandatory<br>
> flow: sources.index -> pipes.preBuild* -> pipemin -> merge with build -> pipes.postMerge* -> dest

Entry point html files (index.html) to be processed with [gulp-pipemin](https://github.com/Frizi/gulp-pipemin).

> example config:
```javascript
sources.index = 'app/index.html';
```

#### sources.assets
> mandatory<br>
> flow: sources.assets -> pipes.asset* hook

Files that will be treated as assets for pipemin. Names of these files will be fed to glob paths in index.html.
Superfluous files are left untouched, but will be loaded into memory during build.

> example config:
```javascript
sources.assets = [
    'app/bower_components/*/*.js',
    'app/bower_components/*/{dist,min,release}/*.{js,css}', // most of the generic bower modules
    sources.js, // include only when serving non-processed js files
    sources.css // include only when serving non-processed css files
    // do not include temp folder here
];
```

#### sources.build
> flow: sources.build -> pipes.build* hook

Files that will be added to final build bypassing pipemin.

### Paths
#### paths.pipeminDist
> alias: paths.dist<br>
> default: 'dist/'

Destination path for build task output directory.

#### paths.pipeminPackage
> alias: paths.package<br>
> default: 'package.zip'

Destination path for package task output file.

### Tasks
#### tasks.pipeminBuild
> alias tasks.build<br>
> default 'build'

_build_ task name.

#### tasks.pipeminPackage
> alias tasks.package<br>
> default 'package'

_package_ task name.

#### tasks.pipeminCleanDist
> alias: tasks.cleanDist<br>
> default: 'clean:dist'

_clean:dist_ task name.

### Order
#### config.pipeminMinify
> alias: config.order.minify<br>
> default: 1000

Minification task order in build processing pipe.

## Api
### Provided Hooks
#### pipes.asset*
> type: source<br>
> flow: pipes.asset* -> pipemin's assetStream

Additional asset sources, good for injecting compiled files into index.html and minification process.

#### pipes.postAssets*
> type: sequence<br>

Do actions on files from pipes.asset* before piping them into pipemin.

#### pipes.build*
> type: source<br>
> flow: pipes.build* -> pipes.postBuild* -> merge with pipemin's output -> pipes.postMerge* -> dest

Additional build output files, bypasses the pipemin and goes straight to postBuild step.

#### pipes.preBuild*
> type: sequence<br>

Do actions on index just before feeding it into pipemin.

#### pipes.postBuild*
> type: sequence<br>

Do actions on files from pipes.build*. Example usage in [gulp-recipe-pipemin-rev](https://github.com/PGSSoft/gulp-recipe-pipemin-rev).

#### pipes.postMerge*
> type: sequence<br>

Do actions on all built files before outputing them to dist.

#### pipes.processJs*
> type: sequence<br>

Process js files gathered by pipemin from index.

#### pipes.processCss*
> type: sequence<br>

Process css files gathered by pipemin from index.

#### pipes.processHtml*
> type: sequence<br>

Process index files after resolving assets by pipemin.

### Used Hooks
#### pipes.assetRaw

Sorts raw assets files by name and places into hook.

#### pipes.processJsMinify

Minify Js with uglify.

#### pipes.processCssMinify

Minify css with csso.

#### pipes.processHtmlMinify

Minify html

[npm-url]: https://npmjs.org/package/gulp-recipe-pipemin-build
[npm-image]: https://nodei.co/npm/gulp-recipe-pipemin-build.png?downloads=true
[depstat-url]: https://david-dm.org/PGSSoft/gulp-recipe-pipemin-build
[depstat-image]: https://img.shields.io/david/PGSSoft/gulp-recipe-pipemin-build.svg?style=flat