/* eslint-disable */
'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var pkginfo = require('./package.json');
var open = require('gulp-open');
var runSequence = require('run-sequence');

var minimist = require('minimist');
var fs = require('fs');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var prompt = require('gulp-prompt');
var clear = require('clear');

gulp.task('default', ['dev-server']);

gulp.task('standard-build', function(callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );

    webpack(myConfig, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack:build', err);
        }
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('dev-server', function() {
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = 'eval';
    myConfig.debug = true;
    myConfig.entry.vendor.push('phaser-debug');

    var entries = {
    'vendor': [
        'phaser'
    ]
    };
    entries['src'] = './index.js';
    myConfig.entry = entries;
    myConfig.plugins.splice(3, myConfig.plugins.length - 3);
    myConfig.plugins.push(new HtmlWebpackPlugin({
        title: 'Janken',
        filename: './index.html',
        template: './index.html',
        inject: false
    }));

    new WebpackDevServer(webpack(myConfig, function(err, stats) {
        gulp.src(__filename).pipe(open({
            uri: 'http://localhost:8080/webpack-dev-server/'
        }));
    }), {
        contentBase: webpackConfig.output.path,
        quiet: true,
    }).listen(8080, 'localhost', function(err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[dev-server]', 'http://localhost:8080/ Root');
        gutil.log('[dev-server]', 'http://localhost:8080/webpack-dev-server/ With browser sync');
    });
});

gulp.task('compress-images', function() {
    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');

    return gulp.src('./src/**/*.+(jpg|jpeg|gif|png)')
        .pipe(changed('./minifiedImages/', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(imagemin())
        .pipe(gulp.dest('./minifiedImages/'));
});

gulp.task('overwrite-images', function() {
    var fs = require('fs');
    var through = require('through2');

    function existsInSource(file) {
        var realPath = './src/' + file.relative;
        try {
            return fs.statSync(realPath).isFile();
        } catch (e) {
            return false;
        }
    }
    return gulp.src('./minifiedImages/**/*.+(jpg|jpeg|gif|png)')
        .pipe(through.obj(function(file, encoder, callback) {
            if (existsInSource(file)) {
                this.push(file);
            }
            return callback();
        }))
        .pipe(gulp.dest('./src/'));
});

gulp.task('build', function(done) {
    runSequence(
        'compress-images',
        'overwrite-images',
        'standard-build',
        done);
});