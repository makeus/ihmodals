const gulp = require('gulp');
const jest = require('gulp-jest').default;
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const fs = require('fs').promises;
const jsdoc2md = require('jsdoc-to-markdown');

gulp.task('javascript', function () {
    const b = browserify({
        entries: ['./src/ihmodals.es.js'],
        debug: true,
        standalone: 'IHModals',
        transform: ['babelify']
    });

    return b.bundle()
        .pipe(source('ihmodals.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', () => {
    process.env.NODE_ENV = 'test';

    return gulp.src('tests').pipe(jest());
});

gulp.task('webserver', () => {
    gulp.src('./')
        .pipe(webserver({
            directoryListing: true,
            open: true,
        }));
});

gulp.task('sass:ihm', () => {
    return gulp.src('./styles/ihmodals.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass:demo', () => {
    return gulp.src('./styles/demo.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./demo'));
});

gulp.task('sass', gulp.parallel(['sass:ihm', 'sass:demo']));

gulp.task('docs', () => {
    return jsdoc2md.render({files: 'src/**/*.js'})
        .then((data) => fs.writeFile('./api.md', data));
});

gulp.task('watch', () => {
    gulp.watch('./src/**/*.es.js', gulp.parallel(['javascript', 'docs']));
    gulp.watch('./styles/**/*.scss', gulp.series('sass'));
    gulp.watch('./tests/**/*.test.js', gulp.series('test'))
});
