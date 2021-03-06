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
const inline   = require('gulp-inline-source');

// error handler
const onError = function (error) {
  notifier.notify({
    title: 'Error',
    message: 'Compilation failure.',
  });

  console.log(error);
  this.emit('end');
};

// clean build dir
gulp.task('clean', () => del('dist'));

// process and minify html
gulp.task('html', ['icons'], () => {
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

// create sitemap xml
gulp.task('sitemap', ['html'], () => {
  gulp.src('dist/**/*.html')
    .pipe(sitemap({
      siteUrl: 'https://brinkcommerce.com',
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

// inline css if link tag has "inline" attribute
gulp.task('inline', ['html', 'sass'], () => {
  return gulp.src('dist/**/*.html')
    .pipe(inline())
    .pipe(gulp.dest('dist'));
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
      const files = bundle.generate(write);
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
    name: 'misc',
    src:  '/{humans.txt,favicon.ico,manifest.json}',
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
  notify: false,
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
  fs.mkdirSync('dist');
  fs.mkdirSync('dist/maps');

  gulp.start(
    'html',
    'sitemap',
    'sass',
    'inline',
    'js',
    'images',
    'icons',
    'fonts',
    'misc');
});

gulp.task('default', ['build', 'server', 'watch']);
