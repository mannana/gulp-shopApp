var gulp = require("gulp"),
	concat = require("gulp-concat"),
	connect = require("gulp-connect"),
	uglify = require("gulp-uglify"),
	less = require("gulp-less"),
	minifyCSS = require('gulp-minify-css'),
    autoprefix = require('gulp-autoprefixer'),
	webpack = require('webpack-stream'),
	named = require('vinyl-named'),
	fileConfigs = require('./config.json');

gulp.task("iconfont", function(){
	gulp.src(["src/css/iconfont/iconfont.eot","src/css/iconfont/iconfont.svg","src/css/iconfont/iconfont.ttf","src/css/iconfont/iconfont.woff"])
	.pipe(gulp.dest("dist/css"))
	.pipe(connect.reload());
});

gulp.task("html", function(){
	gulp.src("src/html/*.html")
	.pipe(gulp.dest("dist"));
});
gulp.task("mock", function(){
	gulp.src("src/mock/*.json")
	.pipe(gulp.dest("dist/mock"));
});
gulp.task("imgs", function(){
	gulp.src("src/imgs/*")
	.pipe(gulp.dest("dist/imgs"));
});

gulp.task("bundleLess", function(){
	gulp.src(fileConfigs.css)
	.pipe(less())
	.pipe(autoprefix())
    // .pipe(minifyCSS())
	.pipe(gulp.dest("dist/css"))
	.pipe(connect.reload());
});

gulp.task("bundleCommonJs",function() {
	gulp.src("src/js/base/*.js")
	.pipe(concat("bundle.js"))
	// .pipe(uglify())
	.pipe(gulp.dest("dist/js"))
	.pipe(connect.reload());
});

gulp.task('bundleJs', function() {
    return gulp.src(fileConfigs.js)
        .pipe(named())
        .pipe(webpack({
            output: {
                filename: '[name].js'
            },
            module: {
                loaders: [{
                    test: /\.mustache$/,
                    loader: 'mustache'
                }, {
                    test: /\.js$/,
                    loader: "imports?define=>false"
                }]
            },
            devtool: "#eval-source-map"
        }))
        .pipe(uglify().on('error', function(e) {
            console.log('\x07',e.lineNumber, e.message);
            return this.end()}
        ))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("watch",function(){
	gulp.watch("src/js/**/*", ["bundleJs"]);
	gulp.watch("src/js/base/*.js",["bundleCommonJs"]);
	gulp.watch("src/css/**/*.less",["bundleLess"]);
	gulp.watch("src/html/*.html",["html"]);
	gulp.watch("src/mock/*", ["mock"]);
});

gulp.task("server",function(){
	connect.server({
		root:"dist",
		port:8010,
		livereload:true
	})
})

gulp.task("default", ["iconfont", "html", "mock","imgs", "bundleCommonJs","bundleJs","bundleLess", "watch", "server"]);
