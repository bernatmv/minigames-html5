var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var entries = {
	'vendor': [
		'phaser'
	]
};

var plugins = [
//	new webpack.optimize.CommonsChunkPlugin('vendor', 'libs/phaser.min.js')
];

if (fs.existsSync('./src/index.js')) {
    entries['./src/'] = './index.js';
    plugins.push(new HtmlWebpackPlugin({
        title: 'PLACEHOLDER GAME TITLE',
        filename: './index.html',
        template: './index.html',
        inject: false
    }));
}

module.exports = {
	cache: false,
	context: path.join(__dirname, 'src'),
	entry: entries,
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '',
		filename: 'app.js'
	},
	module: {
		loaders: [{
			test: /\.js$/i,
			exclude: /node_modules/i,
			loader: 'babel?presets[]=es2015,presets[]=stage-0'
		}, {
			test: /(phaser(-arcade-physics)?|phaser-debug)(\.min)?\.js$/i,
			loader: 'script'
		}, {
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
		alias: {
			'phaser': path.join(__dirname, 'node_modules/phaser/build/phaser.min.js'),
			'phaser-debug': path.join(__dirname, 'node_modules/phaser-debug/dist/phaser-debug.js')
		},
		extensions: ['', '.js']
	},
	plugins: plugins
};