// 引入webpack
var webpack = require("webpack");

// 引入该插件抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const Ex = require('extract-text-webpack-plugin');

// html-webpack-plugin 的功劳。它会自动帮你生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*环境变量配置 dev/online*/
var WEBPACK_ENV = process.env.WEBPACK_ENV || "dev";

/*生成HTML模板*/
var getHtmlConfig=function (name,title) {
    return {
        template : "./src/view/"+name+".html",  //原始文件位置
        filename : "view/"+name+".html",    //输出位置
        title:title,    //生成html文件的title
        inject   : true,
        hash     : true,
        chunks   : ["common",name]   // 指定模板要引用的文件 （若没有指定 则会全部引用）
    };
};

var  config  = {
    entry:{  // 多文件入口
        "common":[__dirname+"/src/page/common/index.js"], // 把common公用的也打包进base.js中，即插件的name设置为common
        "index":[__dirname+"/src/page/index/index.js"],
        "login":[__dirname+"/src/page/login/index.js"],
        "register":[__dirname+"/src/page/register/index.js"],
        "forget-Reset-Password":[__dirname+"/src/page/forget-Reset-Password/index.js"],
        "result":[__dirname+"/src/page/result/index.js"],
        "detail":[__dirname+"/src/page/detail/index.js"],
        "user-center":[__dirname+"/src/page/user-center/index.js"]
    },
    output:{
        path: __dirname + "/dist",//打包后的文件存放的地方  webpack时可不用写此路径 总路径 其他的都基于此
        publicPath: "/dist", //文件访问路径
        filename:'js/[name].js'  //配置多出口 名字为源文件名 根据名字入口文件打包
    },
    //模块：例如解读CSS（css-loader）,图片如何转换，压缩
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: Ex.extract("style-loader", "css-loader")
            },
            {
                test: /\.(gif|png|jpg|jpeg|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=100&name=resource/[name].[ext]'
            },
            {
                test: /\.string$/,
                loader: 'html-loader'
            }
        ]
    },
    externals:{        // 使jquery能在页面中进行模块引用 类似 var $ = require("jquery")
        "jquery":"window.jQuery"
    },
    //配置别名(以简便文件的路径引用)
    resolve: {
        alias:{
            node_modules:__dirname + "/node_modules",
            image:__dirname + "/src/image",
            util:__dirname + "/src/util",
            page:__dirname + "/src/page",
            service:__dirname + "/src/service"
        }
    },
    // webpack插件放在此处
    plugins:[
        //打包通用模块到js/base.js文件
        new webpack.optimize.CommonsChunkPlugin({
            name: "common", /*name：可以是已经存在的chunk（一般指入口文件）对应的name，
                          那么就会把公共模块代码合并到这个chunk上；否则，会创建名字为name的commons chunk进行合并*/
            filename: "js/base.js"
            /*chunks配置属性 chunks：指定source chunk，即指定从哪些chunk当中去找公共模块，
         省略该选项的时候，默认就是entry chunks */
        }),
        //打包单独css文件 (根据chunk入口名取值)
        new Ex("css/[name].css"),
        //html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig("index","首页")),
        new HtmlWebpackPlugin(getHtmlConfig("login","登录")),
        new HtmlWebpackPlugin(getHtmlConfig("register","注册")),
        new HtmlWebpackPlugin(getHtmlConfig("forget-Reset-Password","找回密码")),
        new HtmlWebpackPlugin(getHtmlConfig("result","操作结果")),
        new HtmlWebpackPlugin(getHtmlConfig("detail","书籍详情")),
        new HtmlWebpackPlugin(getHtmlConfig("user-center","个人中心"))
    ]
};
if ("dev" == WEBPACK_ENV)
{
    config.entry.common.push("webpack-dev-server/client?http://localhost:8088/"); // 在common中使用 保证 对所有页面有效
}
module.exports = config;