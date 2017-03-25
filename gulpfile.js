/**
 * Created by Theophy on 10/28/16.
 */
 
var webserver = require('gulp-webserver');
 
var paths = {
    index: 'index.html',
    dist: 'dist/',
    tmp: 'tmp'
};

gulp.task('webserver', function () {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            port: 8888
        }));
});

 
//serve our file for us
gulp.task("serve", gulp.parallel('testWatcher', 'webserver', 'watch')); 