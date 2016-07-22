var gulp = require('gulp');
var harp = require('harp');
var del = require('del');
var ghPages = require('gulp-gh-pages');
var cp = require('child_process');
var clean = require('gulp-rimraf');

/**
 * Serve the Harp Site
 */
gulp.task('serve', function () {
  harp.server(__dirname + '/src', {
    port: 9000
  }, function () {
    // browserSync({
    //   proxy: "localhost:9000",
    //   open: false,
    //   /* Hide the notification. It gets annoying */
    //    notify: {
    //     styles: ['opacity: 0', 'position: absolute']
    //   }
    // });
    // /**
    //  * Watch for sass changes, tell BrowserSync to refresh main.css
    //  */
    // gulp.watch(["src/**/*.sass", "src/**/*.scss"], function () {
    //   reload("main.css", {stream: true});
    // });
    // /**
    //  * Watch for all other changes, reload the whole page
    //  */
    // gulp.watch(["src/**/*.ejs", "src/**/*.json", "src/**/*.md"], function () {
    //   reload();
    // });
  });
});

gulp.task('build', ['clean'], function (done) {
  cp.exec('harp compile src dist', {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('clean', function () {
  del(['dist'])
});

gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(ghPages({
        force: true
    }));
});

gulp.task('default', ['serve']);