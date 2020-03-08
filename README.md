### 项目介绍
ReadEnjoy为公版书共享网站项目,用户可以在上面分享自己所收藏的公版书书籍、下载他人书籍、在线查看书籍以及评论等等。 <br>纯粹为个人兴趣而开发,旨在熟悉前后端分离技术, 以及加强对SSM框架的理解, 还存在很多不足之前, 敬请谅解。该项目分为三个仓库, ReadEnjoyFront、ReadEnjoyAdmin和ReadEnjoyBack。

### 仓库介绍
ReadEnjoyFront仓库为公版书共享网站的用户前端页面, 实现了登录/注册、公版书籍的上传/下载/分享/评论/收藏、书籍在线浏览和公版书作家的介绍等等。

### 页面展示
![主页](https://s2.ax1x.com/2020/03/08/3xkLV0.png "主页")

### 技术说明
- Hogan.js  [模板引擎之hogan.js](cnblogs.com/zhangruiqi/p/8547268.html)
- webpack  ** 注意版本: 1.15.0,尽量使用我的版本,高版本可能会出错
- css-loader,url-loader等加载器也尽量参加package.json的版本进行使用
### 使用说明
- 把项目拉到本地后,使用npm install 安装需要的模块
- 使用webpack编译生成需要发布的文件夹(dist)。若打包出错则卸载file-loader,url-loader,然后重新安装该些模块
- 完成了使用npm run dev运行项目
- 在浏览器输入 http://localhost:8088/ 便可看到网页显示<br>
- 若是出现无法在线浏览书籍内容时,需要将image/FlexPaperViewer.swf放到dist/view文件中 - 原因时webpack打包时无法将该文件打包进去,现还没中找到很好的解决方案

**悄咪咪推荐个人Blog:** [HB's Blog](http://www.huangbin.fun)
