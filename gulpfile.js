// This lets us write series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');

// Helpers
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const rename = require('gulp-rename');
const notify = require('gulp-notify');

// SCSS/CSS Specific Plugins
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const sassLint = require('gulp-sass-lint');

// JS Specific plugins
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');

// Imagemin
const imagemin = require('gulp-imagemin');

// Nunjucks templating
const nunjucksRender = require('gulp-nunjucks-render');

// Browsersync
const browserSync = require('browser-sync');

// JS Config location
const jsConfig = require('./jsbundles.json');

// Favicons and Manifest
const favicons = require('gulp-favicons');



/* Environments / Paths / Notifications */

// Determine the environment
let isDev = (argv.development === undefined) ? false : true;
let isTemplate = (argv.template === undefined) ? false : true;

// Source file paths
const paths = {
    scssPath: 'assets/src/scss/**/*.scss',
    jsPath: ['assets/src/js/**/*.js', '!assets/src/js/output/**/*'],
    imagePath: 'assets/src/images/**/*',
    htmlPath: 'assets/src/templates/**/*.html'
};

// Notifications Template
const notifyGeneric = {
    title: function () {
        return '<%= file.relative %>';
    },
    onLast: true,
    closeLabel: "Dismiss",
    subtitle: "Task Successful"
};



/* SCSS/CSS */

// SASS/CSS Task
const scssTask = () => {
    return src(paths.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('assets/dist/css'))
        .pipe(gulpif(isTemplate, dest('templates/assets/dist/css')))
};

// SCSS Linting
const scssLint = () => {
    return src(paths.scssPath)
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
};



/* JavaScript */

// JSConfig Check
async function jsTask() {
    for (let bundle in jsConfig) {
        if (jsConfig[bundle].bundle === true) {
            jsBundleTask(jsConfig[bundle])
        } else {
            jsSingleTask(jsConfig[bundle])
        }
    }
};

// JS Bundle Task
const jsBundleTask = (cfg) => {
    return src(cfg.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat(cfg.name + '.min.js'))
        .pipe(uglify())
        .pipe(gulpif(isDev, notify(notifyGeneric)))
        .pipe(dest('assets/dist/js'))
        .pipe(gulpif(isTemplate, dest('templates/assets/dist/js'))
        );
};

// JS Single Task
const jsSingleTask = (cfg) => {
    return src(cfg.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpif(isDev, notify(notifyGeneric)))
        .pipe(dest('assets/dist/js'))
        .pipe(gulpif(isTemplate, dest('templates/assets/dist/js'))
        );
};

// JS Linting
const jsLint = () => {
    return src([
        './assets/src/js/**',
        '!./assets/src/js/vendor/**'
    ])
        .pipe(eslint())
        .pipe(eslint.format())
};



/* Images */

// Image Optimizing
const imageOptimize = () => {
    return src(paths.imagePath)
        //.pipe(imagemin())
        //.pipe(gulpif(isDev, notify(notifyGeneric)))
        .pipe(dest('assets/dist/images'))
        .pipe(gulpif(isTemplate, dest('templates/assets/dist/images')))
};



/* Icons/Manifest */

// SASS/CSS Task
const createFavicons = () => {
    return src('assets/src/images/logo.jpg')
        .pipe(
            favicons({
                appName: 'My App',
                appShortName: 'App',
                appDescription: 'This is my application',
                developerName: 'Americaneagle.com',
                developerURL: 'https://americaneagle.com',
                background: '#020307',
                path: 'icons/',
                url: 'http://localhost',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                version: 1.0,
                icons: {
                    // Platform Options:
                    // - offset - offset in percentage
                    // - background:
                    //   * false - use default
                    //   * true - force use default, e.g. set background for Android icons
                    //   * color - set background for the specified icons
                    //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
                    //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
                    //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
                    //
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: false,
                    favicons: true,
                    firefox: true,
                    windows: true,
                    yandex: false,
                },
                logging: false,
                replace: true,
            })
        )
        .pipe(dest('assets/dist/icons'))
        .pipe(gulpif(isTemplate, dest('templates/icons')))
};



/* Nunjucks / Browsersync */

// HTML - Templating
const nunjucks = () => {
    return src(paths.htmlPath)
        .pipe(nunjucksRender({
            path: ['assets/src/templates'],
            data: {
                css_path: '/assets/dist/css/'
            }
        }))
        .pipe(dest('./templates'));
};

// Browsersync Server
const server = () => {
    browserSync.init({
        server: {
            baseDir: ["./templates"]
        }
    })
    templateWatchTask();
};

// Browsersync Reload
const reload = (done) => {
    browserSync.reload();
    done();
};



/* Watch Functions */

// Basic Watch
const watchTask = () => {
    watch(paths.scssPath,
        series(scssTask)
    );

    watch(paths.jsPath,
        series(jsTask)
    );

    watch(paths.imagePath,
        series(imageOptimize)
    );
};

// Browsersync Watch
const templateWatchTask = () => {
    watch(paths.scssPath,
        series(scssTask, reload)
    );

    watch(paths.jsPath,
        series(jsTask, reload)
    );

    watch(paths.imagePath,
        series(imageOptimize, reload)
    );

    watch(paths.htmlPath,
        series(nunjucks, reload)
    );
};



/* Tasks */

// Default Task (build and watch - with notifications)
exports.default = series(
    parallel(scssTask, jsTask, imageOptimize), watchTask
);

// Deploy Task (build only)
exports.deploy = series(
    parallel(scssTask, jsTask, imageOptimize)
);

// Serve Nunjucks Templates
exports.servetemplates = series(
    parallel(jsTask, scssTask, imageOptimize, nunjucks, createFavicons), server
);

// Deploy Nunjucks Templates
exports.deploytemplates = series(
    parallel(jsTask, scssTask, imageOptimize, nunjucks)
);

// Linting Tasks (scss only, js only, or both)
exports.lintcss = series(scssLint);
exports.lintjs = series(jsLint);
exports.lint = series(parallel(jsLint, scssLint));