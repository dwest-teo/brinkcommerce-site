const prefixer = require('autoprefixer');
const sync     = require('browser-sync');
const cssnano  = require('cssnano');
const mqpacker = require('css-mqpacker');
const del      = require('del');
const fs       = require('fs');
const gulp     = require('gulp');
const changed  = require('gulp-changed');
const htmlmin  = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const plumber  = require('gulp-plumber');
const postcss  = require('gulp-postcss');
const sass     = require('gulp-sass');
const maps     = require('gulp-sourcemaps');
const notifier = require('node-notifier');
const rollup   = require('rollup');
const babel    = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve  = require('rollup-plugin-node-resolve');
const uglify   = require('rollup-plugin-uglify');
const svgmin   = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const cheerio  = require('gulp-cheerio');
const sitemap  = require('gulp-sitemap');

// error handler
const onError = function (error) {
  notifier.notify({
    title: 'Error',
    message: 'Compilation failure.',
  });

  console.log(error);
  this.emit('end');
};

// clean
gulp.task('clean', () => del('dist'));

// html
gulp.task('html', ['images', 'icons'], () => {
  return gulp.src('src/html/**/*.html')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true,
    }))
    .pipe(gulp.dest('dist'));
});

// sitemap
gulp.task('sitemap', ['html'], () => {
  gulp.src('dist/**/*.html')
    .pipe(sitemap({
      siteUrl: 'http://brinkcommerce.com'
    }))
    .pipe(gulp.dest('dist'));
});

// sass
const processors = [
  prefixer({ browsers: 'last 2 versions' }),
  mqpacker,
  cssnano({ safe: true }),
];

gulp.task('sass', () => {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(maps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(maps.write('./maps', { addComment: false }))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
});

// js
const read = {
  entry: 'src/js/main.js',
  sourceMap: true,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ['es2015-rollup'],
    }),
    uglify(),
  ],
};

const write = {
  format: 'iife',
  sourceMap: true,
  moduleName: 'main',
};

gulp.task('js', () => {
  return rollup
    .rollup(read)
    .then(bundle => {
      // generate the bundle
      const files = bundle.generate(write);

      // write the files to dist
      fs.writeFileSync('dist/main.min.js', files.code);
      fs.writeFileSync('dist/maps/main.min.js.map', files.map.toString());
    });
});

// images
gulp.task('images', () => {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg}')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('dist/images'))
    .pipe(imagemin({ progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'));
});

// svg sprites
gulp.task('icons', () => {
  return gulp.src('src/icons/*.svg')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('dist/icons'))
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio(function ($) {
      $('svg').attr('style', 'display:none');
    }))
    .pipe(gulp.dest('dist/icons'));
});

// fonts, videos, favicon
const others = [
  {
    name: 'fonts',
    src:  '/fonts/**/*.{css,woff,woff2}',
    dest: '/fonts',
  }, {
    name: 'humans',
    src:  '/humans.txt',
    dest: '',
  }, {
    name: 'favicon',
    src:  '/favicon.ico',
    dest: '',
  }, {
    name: 'manifest',
    src:  '/manifest.json',
    dest: '',
  },
];

others.forEach(object => {
  gulp.task(object.name, () => {
    return gulp.src('src' + object.src)
      .pipe(plumber({ errorHandler: onError }))
      .pipe(gulp.dest('dist' + object.dest));
  });
});

// server
const server = sync.create();
const reload = sync.reload;

const sendMaps = (req, res, next) => {
  const filename = req.url.split('/').pop();
  const extension = filename.split('.').pop();

  if (extension === 'css' || extension === 'js') {
    res.setHeader('X-SourceMap', '/maps/' + filename + '.map');
  }

  return next();
};

const options = {
  notify: true,
  reloadOnRestart: true,
  logPrefix: 'Brink',
  server: {
    baseDir: 'dist',
    middleware: [
      sendMaps,
    ],
  },
  watchOptions: {
    ignored: '*.map',
  },
};

gulp.task('server', ['sass'], () => sync(options));

// watch
gulp.task('watch', () => {
  gulp.watch('src/html/**/*.html', ['html', reload]);
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js', reload]);
  gulp.watch('src/images/**/*.{gif,jpg,png,svg}', ['images', reload]);
  gulp.watch('src/icons/*.svg', ['icons', reload]);
});

// build and default tasks
gulp.task('build', ['clean'], () => {
  // create dist directories
  fs.mkdirSync('dist');
  fs.mkdirSync('dist/maps');

  // run the tasks
  gulp.start('html', 'sitemap', 'sass', 'js', 'images', 'icons', 'fonts', 'humans', 'favicon', 'manifest');
});

gulp.task('default', ['build', 'server', 'watch']);
