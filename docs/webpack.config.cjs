const path = require('path');
const Dotenv = require('dotenv-webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './docs//js/script.js', // The entry point of your application
	output: {
		path: path.resolve(__dirname, 'dist'), // The output directory for bundled files
		filename: 'bundle.js', // The name of the bundled file
	},
	module: {
		rules: [
			// Add any necessary loaders for your project (e.g., babel-loader for transpiling JavaScript)
		],
	},
	plugins: [
		new Dotenv(),
		new NodePolyfillPlugin(),
		// Add any necessary plugins for your project (e.g., HtmlWebpackPlugin for generating an HTML file)
	],
};
