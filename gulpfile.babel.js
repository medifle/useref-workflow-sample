import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';

const $ = gulpLoadPlugins();

gulp.task('styles', ['clean'], () => {
  return gulp.src([
      'app/styles/main.scss',
    ])
    .pipe($.sourcemaps.init())
    .pipe($.if(/\.scss$/, $.sass({
      precision: 10
    }).on('error', $.sass.logError)))
    .pipe($.if(/\.css$/, $.autoprefixer()))
    .pipe($.if(/\.css$/, $.sourcemaps.write('.')))
    .pipe($.size({
      title: 'styles',
      showFiles: true
    }))
    .pipe(gulp.dest('dist/styles'))
});

gulp.task('html', ['clean'], () => {
  return gulp.src('app/index.html')

  .pipe($.useref({
      searchPath: 'app'
      // noconcat: true
    },

    // after assets in HTML is searched out,
    // transform them before concat
    lazypipe()

    .pipe($.sourcemaps.init)
    .pipe(function() {
      return $.if(/\.scss$/, $.sass({
        precision: 10
      }).on('error', $.sass.logError));
    })

    //# @THE ISSUE
    //# it seems gulp-autoprefixer changed the value of "sources" entry in main.css.map,
    //# which in turn cannot be identified by Chrome.
    .pipe(function() {
      return $.if(/\.css$/, $.autoprefixer());
    })
  ))

  .pipe($.if(/\.css$/, $.sourcemaps.write('.')))

  .pipe($.size({
      title: 'html',
      showFiles: true
    }))
    .pipe(gulp.dest('dist'))
});


// Clean output directory
// just for test convenience
gulp.task('clean', cb => del(['dist/*', '!dist/.git'], {
  dot: true
}));
