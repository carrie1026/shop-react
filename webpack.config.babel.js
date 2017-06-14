const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageOpts = require('./package.json')

const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

const dependencies = packageOpts.dependencies
const configEnv = {
    "dev": {
        "cdn": "/",
        "server_add": 'http://192.168.6.63:8080/' // http://de.tcc.so/ dev
    },
    "test": {
        "cdn": "/freedom/",
        "server_add": 'http://192.168.6.63:8080/manage-web/' 
    },
    "stable": {
        "cdn": "/",
        "server_add": 'https://te-code.tcc.so/'
    },
    "prod": {
        "cdn": "/",
        "server_add": 'https://code.tcc.so/'
    }
}

const ENV = process.env.NODE_ENV || 'dev'
const CONFIG = configEnv[ENV]
const CDN_PATH = CONFIG.cdn
const Libs = Object.keys(dependencies)
if (ENV) {
    console.info(`- 部署环境: ${ENV}`)
    console.info(`- 静态文件路径: ${CDN_PATH}`)
    console.info(`- 加载依赖模块: ${Libs.join()}`)
}

const config = {
    // externals: {
    //     // 声明一个外部依赖
    //     fetch: 'fetch'
    // },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                // loader: 'babel!eslint',
                loader:'babel',
                exclude: /node_modules/,
                include: path.resolve(__dirname, './app')
            },
            {
                test: /\.(gif|jpg|png|svg|ico|woff|eot|ttf)$/,
                loader: 'url-loader?limit=2048&name=assets/[name].[hash:8].[ext]',//2k以下的文件会使用base64
                include: path.resolve(__dirname, './app/')
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                include: path.resolve(__dirname, './app')
            },
            {
                test: /\.css$/,
                loader: ENV == 'dev' ?
                    'style!css!postcss?pack=cleaner' :
                    ExtractTextPlugin.extract('style', 'css!postcss?pack=cleaner')
                // include: path.resolve(__dirname, './app')
            },
            {
                test: /\.(scss|sass)$/,
                loader: ENV == 'dev' ?
                    'style!css!postcss?pack=cleaner!sass' :
                    ExtractTextPlugin.extract('style', 'css!postcss?pack=cleaner!sass'),
                include: path.resolve(__dirname, './app')
            }
        ]
    },
    // 自动加游览器前缀
    postcss: () => {
        return {
            cleaner: [autoprefixer({ browsers: ["last 7 version", "ios >= 6", "android >= 4"] })]
        }
    }
}

if (ENV === 'dev') {
    Object.assign(config, {
        // devtool: 'cheap-module-source-map',
        // debug: true,
        devtool: 'source-map',
        // devtool: 'eval-source-map',
        entry: [
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:8080/',
            path.resolve(__dirname, './app/index.js')
        ],
        output: {
            path: BUILD_PATH,
            // filename: 'bundle.js'
            filename: '[name].js'
            // publicPath: CDN_PATH
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                    ENV: JSON.stringify(ENV),
                    PUBLIC_PATH: JSON.stringify(CDN_PATH),
                    SERVER_ADD: JSON.stringify(CONFIG.server_add)
                }
            }),
            new HtmlWebpackPlugin({
                title: 'freedom-design-dev',
                template: path.resolve(__dirname, './app/index.html')
            })
        ]
    })
} else if (ENV === 'test') {
    Object.assign(config, {
        devtool: 'eval-source-map',
        noParse: Object.keys(dependencies),
        entry: {
            main: path.resolve(__dirname, './app/index'),
            libs: Libs //将package.json中dependencies代码打包为libs.js
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'js/[name].[chunkhash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].js',
            publicPath: CDN_PATH
        },
        plugins: [
            new webpack.optimize.DedupePlugin(),//删除交叉依赖的重复项
            new webpack.optimize.OccurenceOrderPlugin(),//比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
            new webpack.optimize.CommonsChunkPlugin({//辨别共用模块并把他们放倒一个文件里面去
                name: ['main', 'libs']
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                    ENV: JSON.stringify(ENV),
                    PUBLIC_PATH: JSON.stringify(CDN_PATH),
                    SERVER_ADD: JSON.stringify(CONFIG.server_add)
                }
            }),
            // 生成index.html到dist目录,并引入js与css
            new HtmlWebpackPlugin({
                title: 'freedom-design',
                template: path.resolve(__dirname, './app/index.html'),
                filename: path.resolve(__dirname, './dist/index.html'),
                chunks: ['main', 'libs'],
                inject: 'body',
                // showErrors: false,
                //minify: true,
                cache: false
            }),
            new ExtractTextPlugin('css/main.[hash:8].css')//外链引入css文件
        ]
    })
}
else {
    Object.assign(config, {
        noParse: Object.keys(dependencies),
        entry: {
            main: path.resolve(__dirname, './app/index'),
            libs: Libs //将package.json中dependencies代码打包为libs.js
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'js/[name].[chunkhash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].js',
            publicPath: CDN_PATH
        },
        plugins: [
            new webpack.optimize.DedupePlugin(),//删除交叉依赖的重复项
            new webpack.optimize.OccurenceOrderPlugin(),//比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
            new webpack.optimize.CommonsChunkPlugin({//辨别共用模块并把他们放倒一个文件里面去
                name: ['main', 'libs']
            }),
            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                    ENV: JSON.stringify(ENV || 'dev'),
                    PUBLIC_PATH: JSON.stringify(CDN_PATH),
                    SERVER_ADD: JSON.stringify(CONFIG.server_add)
                }
            }),
            // 生成index.html到dist目录,并引入js与css
            new HtmlWebpackPlugin({
                title: 'freedom-design',
                template: path.resolve(__dirname, './app/index.html'),
                filename: path.resolve(__dirname, './dist/index.html'),
                chunks: ['main', 'libs'],
                inject: 'body',
                showErrors: false,
                //minify: true,
                cache: false
            }),
            new ExtractTextPlugin('css/main.[hash:8].css')//外链引入css文件
        ]
    })
}
module.exports = config;