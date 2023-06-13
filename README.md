Talon - An Americaneagle.com Toolkit
==========

**Currently stable for Node versions v10 - 14**

## Installation/Setup

1. Confirm Node is installed (https://nodejs.org/en/)
 
2. Open the root folder (containing the package.json) in command line/terminal

3. Run "npm install" to install all dependencies

## Available commands

- `npm run gulp` - Runs SCSS, JS, Image tasks with a watch task

- `npm run gulp-deploy` - Runs the above, without the watch task or notifications (used for single runs or server builds)

- `npm run gulp-serve-templates` - Runs the standard gulp task, along with a browsersync instance using nunjucks templates

- `npm run gulp-deploy-templates` - Runs a single run of the standard gulp task, along with nunjucks template creation

- `gulp-lint` - Will run SCSS and JS linting on applicable files

- `gulp-lint-css` - Runs SCSS linting. Rules can be configured in .sass-lint.yml

- `gulp-lint-js` - Runs JS linting based off of eslint. Rules can be configured in .eslintrc

## Working with Talon

### General Concepts

All file changes should take place in the `assets/src` folder, when the Gulp task runs (or is watching) all changes will be pushed into `assets/dist` which are the files that should be referenced on the front end.

### CSS/SCSS

- All SCSS files for editing are located in `assets/src/scss`.

- There are two CSS files generated from the SCSS - `main.css` and `critical.css`. Import the necessary SCSS files into each, where critical should be placed in the <head> of a site and should contain only "above the fold/critical" styles, while all others can be imported to main.scss which can be placed in at the bottom of the site. Both files should reference variables and utilities.

- External sourcemap files come with both outputted CSS files. If sourcemaps do not apply you may need to edit the sourcemap line in the gulpfile.js, more information can be found here: https://www.npmjs.com/package/gulp-sourcemaps

- All outputted CSS files will be minified and come with auto-prefixing

### JavaScript

- All JS files for editing are located in `assets/src/js`.

- JS files are broken down into separate directories. `functions.js` is typically where most custom global JS will be written however you may split files up individually and bundle as noted below.

**Important** 

- JS files are rendered in two ways: bundled or individually. In order for the JavaScript files to be rendered to `dist`, they need to be set up in the .`jsbundles.json` file. Any files that come with the package have already been set up, but any new files will need to be placed.

- Below is an example of creating a bundle:

```javascript
     "globals" : { // Arbitrary name for the bundle
        "name" : "all", // Sets the name of the bundle file
        "bundle" : true, // Indicates that this will be a bundle
        "src" : [ // Array list of all JS files included in the bundle, these will render in order.
            "assets/src/js/utilities.js",
            "assets/src/js/polyfills/iOS.js",
            "assets/src/js/components/functions.js"
        ]
    },
```
- If the `bundle` key does not exist or is not set to true, any files in the `src` array will be generated as individual JS files

- All files are run through Babel (https://babeljs.io/) and are minified.

### Images

- Images are run through a basic imagemin task to optimize them before use.

### Templating

- Static HTML files are generated using an HTML templating system called Nunjucks: https://mozilla.github.io/nunjucks/

- Out of the box, the `layout.html` file will contain the site shell (document, head, body, header/footer), and individual .html pages are rendered using the layout as their container.

- Partials can be created and any nunjucks feature is available, out of the box this is a mainly simple implementation.

- When running `npm run gulp-serve-templates` - Browsersync is used to render the page locally on your machine, combined with the Gulp watch tasks it allows for live updating as you update any file (html/css/js/images).

- All outputted template files are placed into the a separate `templates` folder OUTSIDE of the root `assets` folder. This `templates` folder contains a copy of the `dist` files. This allows the templates folder to be served up and provided as a static HTML site.

## Summary of Features

- SCSS Compiling
- CSS minification
- CSS auto-prefixing: no need for any vendor prefixes
- CSS linting
- Image optimizing: Images in src will be pushed to dist, and automatically optimized for web
- JS ES6 support: Babel allows for writing up to date JS
- JS bundling through a custom jsbundles.json file in the root
- JS Linting via eslint
- JS minification
- Nunjucks templates: Using partials and includes, creating HTML templates is easier as we don't need to duplicate HTML files and can re-use components
- Browsersync: Local environment for HTML templates, also allows for us to share a local template within the same network.
- Notifications: If a file is successfully compiled, you will be alerted and presented the file size of the finished file. If it fails, you will be provided with specific errors with the compiling.
- Options for both working locally and deploying files through a CI/CD process.

## Dependencies 

- [Gulp](https://www.npmjs.com/package/gulp)
    - Base task runner
- [gulp-if](https://www.npmjs.com/package/gulp-if)
    - Provides if conditionals for gulp tasks
- [yargs](https://www.npmjs.com/package/yargs)
    - Enables checking for environment flags set in the package.json
- [gulp-rename](https://www.npmjs.com/package/gulp-rename)
    - Allows renaming of files
- [gulp-notify](https://www.npmjs.com/package/gulp-notify)
    - Sets notifications for completed tasks
- [gulp-sass](https://www.npmjs.com/package/gulp-sass)
    - Allows for SASS compilation
- [gulp-postcss](https://www.npmjs.com/package/gulp-postcss)
    - Functionality for CSS such as autoprefixing and minifying
    - Gulp plugin for (also included) [PostCSS](https://github.com/postcss/postcss)
    - Includes [autoprefixer](https://github.com/postcss/autoprefixer)
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
    - Sourcemapper for better debugging of CSS in dev tools
- [gulp-sass-lint](https://www.npmjs.com/package/gulp-sass-lint)
    - SASS linter that can be called in a separate task
    - Gulp plugin for original [SassLint](https://github.com/sasstools/sass-lint)
- [gulp-babel](https://www.npmjs.com/package/gulp-babel)
    - Uses basic Babel setup, allows for ES6 JS
    - Gulp plugin for [Babel](https://babeljs.io/)
- [gulp-concat](https://www.npmjs.com/package/gulp-concat)
    - Combines JS files
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
    - Minifies JS files
- [gulp-eslint](https://www.npmjs.com/package/gulp-eslint)
    - JS linter that can be called in a separate task
    - Gulp plugin for [ESLint](https://eslint.org/)
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
    - Optimizes images within the package
    - Gulp plugin for [imagemin](https://github.com/imagemin/imagemin)
- [gulp-nunjucks-render](https://www.npmjs.com/package/gulp-nunjucks-render)
    - Renders Nunjucks HTML templates
    - Gulp plugin to render [Nunjucks templates](http://mozilla.github.io/nunjucks/)
- [browser-sync](https://www.npmjs.com/package/browser-sync)
    - Allows for local development and live reloading
- [gulp-favicons](https://www.npmjs.com/package/gulp-favicons)
    - This is in progress and still being tested
    - Generates a set of favicons and manifest files
    - Gulp plugin for [Favicons](https://github.com/haydenbleasel/favicons)

## TODO/Future updates
- Remove any dependencies possible
    - Consider removing gulp in favor of regular NPM scripts
- Finish Tabs/Toggle setup
- Improve out of box templates
- Decision on favicons
- Decide on OOB carousel slider
- Remove all jQuery dependencies
- Update navigation to use toggles