var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-clean-css');
var less = require('gulp-less');
var proxy = require('http-proxy-middleware');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var fs = require('fs');
var _ = require('lodash');

var source = {
    css: {
        vendor: [
            "css/font-awesome.css",
            "vendor/tippyjs/themes/light.css",
            "vendor/AlertifyJS/build/css/alertify.min.css"
        ],
        src: [
            "css/global.less",
            "css/**/*.less"
        ],
        app: "css/global.less"
    },
    resource: {
        images: 'images/**/*.@(gif|png|jpg)',
        fonts: 'fonts/**/*'
    },
    js: {
        src: [
            "js/global.js"
        ]
    }
};

gulp.task('css-vendor', async () => {
    await  gulp.src(source.css.vendor)
        .pipe(concat('vendor.css'))
        .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest("styles/css"));
});
gulp.task('css-app', async () => {
    await gulp.src(source.css.app)
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(replace('@charset "utf-8";', ''))
        .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest("styles/css"));
});

gulp.task('copy', done => {
    gulp.src(source.resource.images)
        .pipe(imagemin())
        .pipe(gulp.dest('styles/images'));
    gulp.src(source.resource.fonts)
        .pipe(gulp.dest('styles/fonts'));
    done()
});

gulp.task('js', async () => {
    await  gulp.src(source.js.src)
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest("build"));
});

gulp.task('image', async () => {
    await imageTask();
});

gulp.task('watch', done => {
    gulp.watch(source.css.src, gulp.series('css-app'));
    gulp.watch(source.js.src, gulp.series('js'));
    gulp.watch(source.resource.images, gulp.series('image'));

    done()
});

gulp.task('connect', async () => {
    await connect.server({
        port: 9090,
        livereload: true,
        // middleware: function(connect, opt) {
        //     return [
        //         proxy('/ZDynServer',  {
        //             target: 'http://61.129.51.183:7070/ZDynServer',    //代理的目标地址
        //             changeOrigin:true,
        //             pathRewrite:{
        //                 '^/ZDynServer': ''
        //             }
        //         })
        //     ]
        // }
    });
});

var scripts = require('./app.scripts.json');
gulp.task('js-vendor', async () => {
    await _.forIn(scripts.chunks, function(chunkScripts, chunkName) {
        var paths = [];
        chunkScripts.forEach(function(script) {
            var scriptFileName = scripts.paths[script];

            if (!fs.existsSync(__dirname + '/' + scriptFileName)) {

                throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName, script)
            }
            paths.push(scriptFileName);
        });
        gulp.src(paths)
            // .pipe(uglify())
            .pipe(concat(chunkName + '.js'))
            .pipe(gulp.dest("build"))
    })

});

gulp.task('css', gulp.parallel('css-vendor', 'css-app'));
gulp.task('prod', gulp.parallel('copy', 'css', 'js-vendor', 'js'));
gulp.task('dev', gulp.parallel('copy', 'css', 'watch', 'connect'));
gulp.task('default', gulp.series('dev'));

var imageTask = function() {
    return gulp.src(source.resource.images)
        .pipe(imagemin())
        .pipe(gulp.dest('styles/images'));
}