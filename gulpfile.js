"use strict"

const gulp = require('gulp');
const stylus = require('gulp-sass');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('default', function(){
	/*search files in the indicated way: путь и тип файлов*/
	return gulp.src(['source/**/*.js', 'source/**/*.css'], {read: false}) 
	.on('data', function(file) {
		console.log(file);
	})
	.pipe(gulp.dest(function(file){
		/*write down(copy) files to the indicated way depending on their type*/
		return file.extname == '.js' ? 'dest/js' :
		file.extname == '.css' ? 'dest/css' : 'dest';
	}));
});
//gulp.task('example', gulp.series('taskname', 'taskname', 'taskename'))
//gulp.task('example', gulp.parallel('taskname', 'taskname', 'taskename'))
gulp.task('styles', function(){
	return gulp.src('frontend/**/main.sass')
	/*преобразует полученные из пути вше файлы при пом. модуля из переменной stylus*/
	//.pipe(debug({title: 'src'}))
	.pipe(gulpIf(isDevelopment, sourcemaps.init())) //присваивает св-во file.sourceMap,куда добав.все измен.
	.pipe(stylus())
	//.pipe(debug({title: 'stylus'}))
	/*соединяет фалы в один при пом.модуля из переменной concat
	.pipe(concat('all.css'))*/
	//.pipe(debug({title: 'concat'}))
	.pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
	.pipe(gulp.dest('public'));
}); 

gulp.task('clean', function(){
	return del('public');
});

gulp.task('assets', function(){
	return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
	.pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
	'clean', 
	gulp.parallel('styles', 'assets'))
	);

gulp.task('watch', function() {
gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));
gulp.watch('frontend/assets/**/*.*', gulp.series('assets')); 
});

gulp.task('dev', gulp.series('build', 'watch'));