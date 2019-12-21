const path = require('path');
const fs = require('fs');
const console = require('console');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const os = require('os');

var webpack = require('webpack');

function getSubpagesInFolder(folderpath, re_basefile)
{
	var rg = [];

	fs.readdirSync(path.resolve(__dirname, folderpath))
		.map(function (item)
		{
			const path = `${folderpath}/${item}`;
			const isDir = fs.lstatSync(path).isDirectory();

			//console.log(folderpath, path, item);

			if (isDir)
				rg = rg.concat(getSubpagesInFolder(path, re_basefile));
			else if (item.match(re_basefile))
			{
				rg.push(path);
			}
		})
		;
	return rg;
}


function makelibconfig(argv)
{
	const isDevelopment = (argv.mode === 'development');
	const comm = makecommonconfig(argv);

	const libentryfiles = getSubpagesInFolder('src', /^(?!index).*\.js$/i).reduce((o, page) => ({ ...o, [page.replace("src/", "").replace(".js", "")]: "./" + page }), {});
	console.log("libentryfiles", libentryfiles);

	const config =
	{
		...comm,
		entry: libentryfiles,
		output: {
			path: path.resolve(__dirname, "dist"),
			//filename: "[name].js",
			libraryTarget: "umd",
			library: "Pele",
			publicPath: "/"
			//        globalObject: "this"
		},
		plugins:
			[

				isDevelopment ? new NothingPlugin() : new CleanWebpackPlugin()
			],
	}

	return config;
}

function makehtmlconfig(argv)
{
	const isDevelopment = (argv.mode === 'development');
	const comm = makecommonconfig(argv);

	const htmlfiles = getSubpagesInFolder('src', /.*\.html$/i);
	const entryfiles = getSubpagesInFolder('src', /index\.js/i).reduce((o, page) => ({ ...o, [page.replace("src/", "").replace(".js", "")]: "./" + page }), {});

	console.log("htmlfiles", htmlfiles);
	console.log("entry", entryfiles);

	const config =
	{
		...comm,
		entry: entryfiles,
		output: {
			path: path.resolve(__dirname, "dist")
		},
		plugins:
			[
				...htmlfiles.map(page => new HtmlWebpackPlugin({
					template: page,
					filename: page.replace("src/", ""),
					hash: true,
					inject: true,
					chunks: [page.replace("src/", "").replace(".html", "")]

				})),
				new MiniCssExtractPlugin({
					//filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
					filename: '[name].css',
					chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css'
				}),
			],
	}
	return config;
}

function NothingPlugin()
{
	this.apply = function () { };
}

function makecommonconfig(argv)
{
	const isDevelopment = (argv.mode === 'development');


	const config = {
		optimization:
		{
			minimize: !isDevelopment
		},
		externals: {
			"lodash": {
				commonjs: 'lodash',
				commonjs2: 'lodash',
				amd: 'lodash',
				root: '_',
			}
		},
		devServer: {
			port: 3333,
		},
		resolve: {
			extensions: ['.js', '.scss'],
			alias: {
				seedrandom: "seedrandom/seedrandom.min.js"
			}
		},
		module: {
			rules: [
				{
					test: /\.pug$/,
					use: ["pug-loader"]
				},
				{
					test: /\.html$/,
					use: [{
						loader: 'html-loader',
						options: {
							minimize: true
						}
					}],
				},
				{
					test: /\.(js)$/,
					exclude: /(node_modules)/,
					use: "babel-loader"
				},
				{
					test: /\.module\.s(a|c)ss$/,
					loader: [
						/*isDevelopment ? 'style-loader' : */MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								modules: true,
								sourceMap: isDevelopment
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isDevelopment
							}
						}
					]
				},
				{
					test: /\.s(a|c)ss$/,
					exclude: /\.module.(s(a|c)ss)$/,
					loader: [
						/*isDevelopment ? 'style-loader' :*/ MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								sourceMap: isDevelopment
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isDevelopment
							}
						}
					]
				}
				, {
					test: /\.(png|jpg|svg)$/,
					use: {
						loader: 'url-loader'
						, options: {
							limit: 8192,
						}
					}
				},
				{
					test: /\.ttf$/,
					use: [
						{
							loader: 'ttf-loader',
							options: {
								name: './font/[hash].[ext]',
							},
						},
					]
				},
				{
					test: /\.(eot|woff|woff2)$/,
					loader: 'file-loader',
					options: {
						name: 'fonts/[name].[ext]'
					}
				}

			]
		}
	}

	return config;
}



module.exports = (env, argv) =>
{
	/*
	if (argv.mode === 'development') { }
	if (argv.mode === 'production') { }
	return config;
*/

	return [makelibconfig(argv), makehtmlconfig(argv)];
}