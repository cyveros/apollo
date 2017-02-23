const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const eslint = require('gulp-eslint');
const webpack = require('webpack-stream');

gulp.task('lint', () => {
	return gulp.src('src/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format('table'))
		.pipe(eslint.failAfterError());
});

gulp.task('clean', ['clean:server']);

gulp.task('clean:server', () => {
	return del([
		'dist/**/*'
	]);
});

gulp.task('clean:csm', () => {
	return del([
		'public/dist/**/*'
	]);
});

gulp.task('build:server', ['clean:server'], () => {
	return gulp.src("src/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('build:csm', ['clean:csm'], () => {
	return gulp.src('csm/src/**/*')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('public/dist/'));
});

gulp.task('build', ['build:server']);

gulp.task('serve', ['build'], () => {
	nodemon({
		script: 'bin/www'
	});
});

gulp.task('watch', () => {
	livereload.listen();

	gulp.watch(['src/**/*.js'], ['build']);
});

gulp.task('dev', ['serve', 'watch']);

