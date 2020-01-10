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
			filename: "[name].js",
			libraryTarget: "umd",
			library: "Pele",
			publicPath: "/"
			//        globalObject: "this"
		},
		plugins:
			[
				  
			//	isDevelopment ? new NothingPlugin() : new CleanWebpackPlugin()
			],
	}

	return config;
}

function getlocalip()
{
	const net = os.networkInterfaces();

	const en1 = net.en1;
	console.debug("net", net);
	for(let interface in en1)
	{
		const i = en1[interface];
		if(i && i.family == 'IPv4')
			return i.address;
	}

	return "localhost";
}

function makehtmlconfig(argv)
{
	const isDevelopment = (argv.mode === 'development');
	const comm = makecommonconfig(argv);

	const htmlfiles = getSubpagesInFolder('src', /.*\.html$/i);
	const entryfiles = getSubpagesInFolder('src', /index\.js/i).reduce((o, page) => ({ ...o, [page.replace("src/", "").replace(".js", "")]: "./" + page }), {});

	console.log("htmlfiles", htmlfiles);
	console.log("entry", entryfiles);

	function scripttag(src)
	{
		return src? `<script src="${src}"></script>` : "";
	}

	const servicehost = argv.service_host ? argv.service_host : (os.hostname() + ":3000");
	//const servicehost = argv.service_host ? argv.service_host : (getlocalip() + ":3000");
	console.log("Service Host:", servicehost);

	const rgConstants ={...[
		["URL_D3_LIBRARY", null, "https://cdnjs.cloudflare.com/ajax/libs/d3/5.14.2/d3.min.js"],
		["URL_LODASH_LIBRARY", null, "https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"],
		["URL_MUURI_LIBRARY", null, "https://unpkg.com/muuri@0.8.0/dist/muuri.min.js"],
		["URL_WEB_ANIMATIONS_LIBRARY", null, "https://unpkg.com/web-animations-js@2.3.2/web-animations.min.js"],
	].reduce((o,e) => ({...o, [e[0]]: JSON.stringify(scripttag(isDevelopment?e[1]:e[2]))  }), {}),
	...[
	].reduce((o,e) => ({...o, [e[0]]: JSON.stringify(isDevelopment?e[1]:e[2]) }), {})	,

	HOST_ATHEOS_LIBRARY:JSON.stringify(servicehost),
	}
	;

	console.log("rgConstants", rgConstants);

	const config =
	{
		...comm,
		entry: entryfiles,
		output: {
			path: path.resolve(__dirname, "dist")
		},
		plugins:
			[
				new webpack.DefinePlugin(rgConstants),

				...htmlfiles.map(page => new HtmlWebpackPlugin({
					template: page,
					filename: page.replace("src/", ""),
					hash: true,
					inject: true,
					chunks: [page.replace("src/", "").replace(".html", "")],

					

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
		//devtool: isDevelopment? 'source-map':false
		devtool: 'source-map',
		externals: {
			...(isDevelopment? {}: 
				{
					"d3":"d3",
					"Muuri":"Muuri",
					"lodash": {
						commonjs: 'lodash',
						commonjs2: 'lodash',
						amd: 'lodash',
						root: '_',
					},

				} )
		},
		devServer: {
			port: 3333,
			host:'0.0.0.0'
		},
		resolve: {
			extensions: ['.js', '.scss'],
			alias: {
				seedrandom: "seedrandom/seedrandom.min.js",
				//d3:"d3/dist/d3.min.js"
			}
		},
		module: {
			rules: [
				{
					test: /\.pug$/,
					use: ["pug-loader"]
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
							loader:"postcss-loader",
							options:{
								sourceMap:isDevelopment
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
							loader:"postcss-loader",
							options:{
								sourceMap:isDevelopment
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