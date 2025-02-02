"use strict";

var gulp = require("gulp");
var sass = require("gulp-dart-sass");
var async = require("async");
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

const buildSass = () => gulp.src("wwwroot/css/*.scss")
	.pipe(sass().on("error", sass.logError))
	.pipe(cleanCSS())
	.pipe(gulp.dest("wwwroot/css"));

const copyGovukAssets = () => gulp.src(["node_modules/govuk-frontend/govuk/assets/**/*"]).pipe(gulp.dest("wwwroot/assets")).on("end", () =>
	gulp.src(["node_modules/govuk-frontend/govuk/all.js"]).pipe(uglify()).pipe(rename("govuk.js")).pipe(gulp.dest("wwwroot/js/")));

gulp.task("sass", buildSass);

gulp.task("sass:watch", function () {
	gulp.watch("wwwroot/css/*.scss", gulp.series("sass"));
});

gulp.task("copy-gov-fe-assets", copyGovukAssets);

gulp.task("build-fe", () => {
	return async.series([
		(next) => buildSass().on("end", next),
		(next) => copyGovukAssets().on("end", next),
		(next) => gulp.src(["wwwroot/js/site.js"]).pipe(uglify()).pipe(rename("site.min.js")).pipe(gulp.dest("wwwroot/js")).on("end", next)
	])
});
