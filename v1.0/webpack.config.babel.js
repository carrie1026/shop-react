const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const packageOpts = require("./package.json");

const dependencies = packageOpts.dependencies;
const configEnv = {
    "dev": {
        "cdn": "/static/",
        "appId": "wx940d10035af3af88",
        "server_add" : '/'
    },
    "test": {
        "cdn": "//cdn-test.sao.so/webcontent/shop-consumer/dist/",
        "appId": "wx940d10035af3af88",
        "server_add" : '/'
    },
    "stable": {
        "cdn": "//cdn-stable.sao.so/webcontent/shop-consumer/dist/",
        "appId": "wx3b396398f188d165",
        "server_add" : '/'
    },
    "prod": {
        "cdn": "//cdn.sao.so/webcontent/shop-consumer/dist/",
        "appId": "wx1c822632d7cb2a6a",
        "server_add" : '/'
    }
}

const ENV = process.env.NODE_ENV || 'dev';
const CONFIG = configEnv[ENV];
const PUBLIC_PATH = CONFIG.cdn;
const Libs = Object.keys(dependencies)
if(ENV){
    console.info(`- 部署环境：${ENV}`);
    console.info(`- 静态文件路径${PUBLIC_PATH}`);
    console.info(`- 部署框架模块${Libs.join(' ')}`)
}

const config = {
    externals : {
        // 声明一个外部依赖。
        nprogress : 'NProgress',  //   import NProgress from 'nprogress'
        fetch : 'fetch'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'] //import模块，默认后缀
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader:  `babel!eslint`,
                exclude: /node_modules/,
                include: path.resolve(__dirname, './src')
            },
            {
                test: /\.(gif|jpg|png|svg|ico|woff|eot|ttf)$/,
                loader: 'url-loader?limit=2048&name=assets/[name].[hash:8].[ext]',//2k以下的文件会使用base64
                include: path.resolve(__dirname, './src/')
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                include: path.resolve(__dirname, './src')
            },
            {
                test: /\.css$/,
                loader: ENV == 'dev' ? 
                        'style!css!postcss?pack=cleaner' : 
                        ExtractTextPlugin.extract('style','css!postcss?pack=cleaner'),
                //include: path.resolve(__dirname, './src')
            },
            {
                test: /\.(scss|sass)$/,
                loader: ENV == 'dev' ? 
                        'style!css!postcss?pack=cleaner!sass' : 
                        ExtractTextPlugin.extract('style','css!postcss?pack=cleaner!sass'),
                include: path.resolve(__dirname, './src')
            }
        ]
    },
  //postcss 自动加浏览器前缀
    postcss: () => {
        return {
            cleaner:  [autoprefixer({ browsers: ["last 7 version", "ios >= 6", "android >= 4"] })]
        };
    }
}

if(ENV == 'dev'){
    Object.assign(config,{
        devtool : 'cheap-module-source-map',
        entry : [
            'webpack-hot-middleware/client',
            path.resolve(__dirname, './src/index')
        ],
        output : {
            path: path.resolve(__dirname, './static/'),
            filename: 'bundle.js',
            publicPath: PUBLIC_PATH
        },
        plugins : [
            new webpack.HotModuleReplacementPlugin(),//热替换
            new webpack.NoErrorsPlugin(), //不会因为错误，中断server
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("development"),
                    ENV : JSON.stringify(ENV),
                    PUBLIC_PATH : JSON.stringify(PUBLIC_PATH),
                    APP_ID : JSON.stringify(CONFIG.appId),
                    SERVER_ADD : JSON.stringify(CONFIG.server_add)
                }
            })
        ]
    })
}else{
    Object.assign(config,{
        noParse : Object.keys(dependencies),
        entry : {
            main : path.resolve(__dirname, './src/index'),
            libs : Libs //将package.json中dependencies代码打包为libs.js
        },
        output : {
            path: path.resolve(__dirname, './dist'),//部署写入磁盘的地址
            filename: 'js/[name].[chunkhash:8].js',
            chunkFilename: "js/[name].[chunkhash:8].js",
            publicPath: PUBLIC_PATH //打包后文件引入的path，可用于cdn地址或者静态资源目录
        },
        plugins : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name : ["main", "libs"]
            }),
            new webpack.optimize.UglifyJsPlugin({
                minimize:true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production"),
                    ENV : JSON.stringify(ENV || "dev"),
                    PUBLIC_PATH : JSON.stringify(PUBLIC_PATH),
                    APP_ID : JSON.stringify(CONFIG.appId),
                    SERVER_ADD : JSON.stringify(CONFIG.server_add)
                }
            }),
            //生成index.html到dist目录,并引入js与css
            new HtmlWebpackPlugin({
                //title: 'demo for react',//title in index.hmtl
                template: path.resolve(__dirname, './src/index.html'),
                filename: path.resolve(__dirname, './dist/index.html'),
                chunks: ['main','libs'],
                inject: 'body',
                showErrors : false,
                //minify : true,
                cache : false,
                piwikId : CONFIG.piwikId
            }),
            //外链引入css文件
            new ExtractTextPlugin("css/main.[hash:8].css")
        ]
    })
}
module.exports = config;