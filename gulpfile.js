const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const eslint = require('gulp-eslint');
const tsc = require('gulp-typescript');
const tsProject = tsc.createProject('web-client/src/tsconfig.json');
const exec = require('child_process').exec;

gulp.task('lint', () => {
	return gulp.src('server/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format('table'))
		.pipe(eslint.failAfterError());
});

gulp.task('clean', ['clean:server', 'clean:web-client']);

gulp.task('clean:server', () => {
	return del([
		'dist/server/**/*'
	]);
});

gulp.task('clean:web-client', () => {
	return del([
		'dist/web-client/**/*'
	]);
});

gulp.task('build:server', ['clean:server'], () => {
	return gulp.src("server/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/server'));
});

gulp.task('build:web-client', ['clean:web-client'], () => {
	exec('ng build');
});

gulp.task('build', ['build:server']);

gulp.task('serve', ['build'], () => {
	nodemon({
		script: 'bin/www'
	});
});

gulp.task('watch', () => {
	livereload.listen();

	gulp.watch('server/**/*.js', ['build']);
});

gulp.task('dev', ['serve', 'watch']);

