const gulp = require('gulp')
const babel = require('gulp-babel')
const minify = require('gulp-minify')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')

gulp.task('js', () => {
    gulp.src('js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(minify({
            noSource: true,
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('dist/js'))

    gulp.src('js/lib/*.js')
        .pipe(gulp.dest('dist/lib/js'))
})

gulp.task('css', () => {
    gulp.src('css/*.css')
        .pipe(autoprefixer({
            browsers: ['>1%']
        }))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('default', ['css', 'js'])