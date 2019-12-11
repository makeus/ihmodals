const gulp = require('gulp');
const jest = require('gulp-jest').default;
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const fs = require('fs').promises;
const jsdoc2md = require('jsdoc-to-markdown');
const rename = require('gulp-rename');

gulp.task('javascript', function () {
    const b = browserify({
        entries: ['./src/ihmodals.js'],
        debug: true,
        standalone: 'IHModals',
        transform: ['babelify']
    });

    return b.bundle()
        .pipe(source('ihmodals.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./docs'))
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
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./docs'));
});

gulp.task('sass:docs', () => {
    return gulp.src('./styles/docs.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./docs'));
});

gulp.task('sass', gulp.parallel(['sass:ihm', 'sass:docs']));

gulp.task('docs', () => {
    return jsdoc2md.render({files: 'src/**/*.js'})
        .then((data) => fs.writeFile('./docs/api.md', data));
});

gulp.task('copy', () => {
    return gulp.src(['./src/ihmodals.js', 'styles/ihmodals.scss'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
    gulp.watch('./src/**/*.js', gulp.parallel(['javascript', 'docs', 'copy']));
    gulp.watch('./styles/**/*.scss', gulp.series('sass'));
    gulp.watch('./tests/**/*.test.js', gulp.series('test'))
});

gulp.task('build', gulp.series(['test', gulp.parallel(['copy', 'docs', 'javascript', 'sass'])]));