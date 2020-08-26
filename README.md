## Overview

Imensity Layout

### Installation & Use

| How To                                | Command                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Install dependencies | run `npm install`, see `package.json` file|
| Sass compile                           | run `gulp serve` or `gulp` for production|
| Performance optimization               | Minify and concatenate JavaScript, CSS, HTML and images to help keep your pages lean. (Run `gulp` to create an optimised version of your project to `/dist`, or you can run `gulp serve:dist`)|
| ES2015 via Babel 6.0                   | Optional ES2015 support using [Babel](https://babeljs.io/). To enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the [.babelrc](.babelrc) file. ES2015 source code will be automatically transpiled to ES5 for wide browser support.  |
| Built-in HTTP Server                   | A built-in server for previewing your site locally while you develop |
| Live Browser Reloading                 | Reload the browser in real-time anytime an edit is made without the need for an extension. (Run `gulp serve` and edit your files) |
| Cross-device Synchronization           | Synchronize clicks, scrolls, forms and live-reload across multiple devices as you edit your project. Powered by [BrowserSync](http://browsersync.io). (Run `gulp serve` and open up the IP provided on other devices on your network) |            
| PageSpeed Insights                     | Web performance metrics showing how well your site performs on mobile and desktop (Run `gulp pagespeed`)             |

## Quickstart

clone this repository and build on what is included in the `app` directory.

There is a HTML starting point, from which you can choose:

- `index.html` - the default starting point, containing Material Design layout.

Be sure to look over the [installation docs](docs/install.md) to verify your environment is prepared to run WSK.
Once you have verified that your system can run WSK, check out the [commands](docs/commands.md) available to get started.
