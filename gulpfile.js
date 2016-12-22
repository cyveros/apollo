var del = require('del');
var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var eslint = require('gulp-eslint');

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

