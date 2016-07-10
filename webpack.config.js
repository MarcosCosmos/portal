var webpack = require('webpack');
var path = require("path");
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var publicPath = require('./publicPath.js').publicPath;
module.exports =
{
	target: 'web',
	entry:
	{
		loader: './src/init/loader.js',
		'ch-loader': './src/init/ch-loader.js',
		framedPage: './src/core/layout/popup/framedPage.js',
		jquery: ['jquery', 'jquery-ui/core.js', 'jquery-ui/draggable.js', 'jquery-ui/droppable.js', 'jquery-ui/resizable.js', 'style!css!modules/jquery-ui/themes/base/jquery.ui.core.css', 'style!css!modules/jquery-ui/themes/base/jquery.ui.theme.css','style!css!modules/jquery-ui/themes/base/jquery.ui.resizable.css'],
	},
	output:
	{
		path: './bin',
		filename: '[name].js',
		publicPath: publicPath
	},
	module:
	{
		loaders:
		[
		    {
		      loader: "babel-loader",

		      // Skip any files outside of your project's `src` directory
		      include: [
		        path.resolve(__dirname, 'src')
		      ],

		      // Only run `.js` and `.jsx` files through Babel
		      test: /\.jsx?$/,

		      // Options to configure babel with
		      query: {
		        plugins: ['transform-runtime'],
				presets: [
				   require.resolve('babel-preset-es2015'),
				   require.resolve('babel-preset-stage-0'),
				 ],
		      }
		  },
			{ test: /\.jpe?g$/,    loader: "url-loader?prefix=resources/&limit=10000&minetype=image/jpg" },
			{ test: /\.png$/,    loader: "url-loader?prefix=resources/&limit=10000&minetype=image/png" },
			{
				include: [
				  path.resolve(__dirname, 'src')
			  ],
				test: /\.s?css$/,
			    loader: ExtractTextPlugin.extract("style", "css!sass!postcss-loader")
			}
        ]
    },
	postcss: function () {
		return [autoprefixer];
	},
	plugins: [
		new webpack.ProvidePlugin({
			  "$": "jquery",
			  "jQuery": "jquery"
		}),
		new HtmlWebpackPlugin({
			title: 'Portal: A Chatango Multi-Chat App',
			filename: 'index.html',
			template: './src/init/index.html',
			chunks:['loader','jquery']
		}),

		new HtmlWebpackPlugin({
			title: 'Copyright & Credits - Portal: A Chatango Multi-Chat App',
			filename: 'credits.html',
			template: './src/content/pages/credits.html',
			chunks: ['framedPage','jquery']
		}),

		new webpack.optimize.CommonsChunkPlugin({name:'jquery', chunks:['loader', 'ch-loader', 'framedPage', 'jquery'], minChunks:Infinity, async:true}),
		new ExtractTextPlugin('common.css', {allChunks: true})
	],
	resolve : {
		alias: {
		  // bind version of jquery-ui
		//   'jquery-ui': 'jquery-ui/core.js','jquery-ui/draggable.js', 'jquery-ui/droppable.js', 'jquery-ui/resizable.js'],
		  'jquery-ui-css': 'jquery-ui/themes/base',
		  // bind to modules;
		  modules: path.join(__dirname, "node_modules"),
		}
	}
}