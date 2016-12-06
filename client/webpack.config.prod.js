var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');


var entries = {
	'main': [
		'pixi', 'p2', 'phaser', './index.js'
	],
};

var plugins = [
    new webpack.DefinePlugin({
         'process.env': {
           SERVER: `"//jankengame-pro.eu-west-1.elasticbeanstalk.com/"`,
           NODE_ENV: JSON.stringify('production')
         }
       }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        debug: false,
        compressor: {
          warnings: false,
          screw_ie8: true,
          drop_console: true
        },
        output: {
          comments: false
        },
        minimize: true,
        sourceMap: false
    }),
    new webpack.optimize.AggressiveMergingPlugin()
];


if (fs.existsSync('./src/index.js')) {
    plugins.push(new HtmlWebpackPlugin({
        title: 'PLACEHOLDER GAME TITLE',
        filename: './index.html',
        template: './index.html',
        inject: false
    }));
}

module.exports = {
	cache: false,
    devtools: 'cheap-module-source-map',
	context: path.join(__dirname, 'src'),
	entry: entries,
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '',
		filename: 'js/app.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			 exclude: /(node_modules|bower_components)/,
			 loader: 'babel-loader',
			 query: {
			   presets: ['es2015'],
               plugins: ['add-module-exports']
			 }
		},
        { test: /pixi\.js/, loader: 'expose?PIXI' },
        { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
        { test: /p2\.js/, loader: 'expose?p2' }, {
			test: /\.json$/i,
			exclude: /\.audiosprite\.json$/i,
			loader: 'json'
		}, {
			test: /\.audiosprite\.json$/i,
			loader: 'file?name=[path][name].[ext]?[hash]'
		}, {
			test: /\.xml$/i,
			loader: 'file?name=[path][name].[ext]?[hash]'
		}, {
			test: /\.css$/i,
			loader: 'style!css'
		}, {
			test: /\.less$/i,
			loader: 'style!css!less'
		}, {
			test: /\.(jpe?g|png|gif)$/i,
			loader: 'file?name=[path][name].[ext]?[hash]'
		}, {
			test: /\.(mp3|ac3|ogg|m4a)$/i,
			loader: 'file?name=[path][name].[ext]?[hash]'
		}, {
			test: /\.(ttf|woff|eot|woff2|svg)$/i,
			loader: 'file?name=[path][name].[ext]?[hash]'
		}]
	},
	resolve: {
		extensions: ['', '.js'],
        alias: {
            'phaser': phaser,
            'Phaser': phaser,
            'pixi': pixi,
            'p2': p2,
         }
	},
	plugins: plugins
};
