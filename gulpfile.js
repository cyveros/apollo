const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
	return gulp.src('src/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format('table'))
		.pipe(eslint.failAfterError());
});

gulp.task('clean', () => {
	return del([
		'lib'
	]);
});

gulp.task('build', ['clean'], () => {
	return gulp.src("src/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('lib'));
});

gulp.task('serve', () => {
	nodemon({
		script: 'bin/www'
	});
});

gulp.task('watch', () => {
	livereload.listen();

	gulp.watch('src/**/*.js', ['build']);
});

gulp.task('dev', ['serve', 'watch']);

