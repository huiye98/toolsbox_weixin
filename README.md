# 开发基础知识

## 官方教程

快速开始： https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/ 


### 基本架构

教程在这里:  https://developers.weixin.qq.com/miniprogram/dev/framework/config.html 

#### 页面架构

![1577629407003](C:\Users\yehui\AppData\Roaming\Typora\typora-user-images\1577629407003.png)

![1577629622706](C:\Users\yehui\AppData\Roaming\Typora\typora-user-images\1577629622706.png)

#### 新建页面：

右键pages，新建目录，在新建的目录右键，新建page，然后在pages/index/index.wxml里面添加新页面的入口就行



**总应用**和每个**页面**都会有：JSON/JS/WXML/WXSS四个文件

##### 总的应用

###### **app.json**   对窗口进行全局的配置

```json
{
  "pages": [
    "pages/index/index",//第一个是首页
    "pages/logs/index"
  ]
}
```

######  app.js  调用APP注册应用

```javascript
App({
  onLaunch: function () {
    // 小程序启动之后 触发
  }
    //注册各种方法
})
```

###### app.wxss

总的样式文件，相当于CSS

###### app.wxml

模板,渲染页面（相当于HTML，组件封装的更好，语法稍稍不同）

可以使用{{ }}, wx:if ,wx:for 等

##### 页面

同样有四个文件

###### page.json   注册页面特有的配置

```json
{
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "navigationBarTitleText": "微信接口功能演示",
  "backgroundColor": "#eeeeee",
  "backgroundTextStyle": "light"
}
```

###### page.js  调用Page注册页面

```js
//index.js
Page({
  data: {
    text: "This is page data."
  },
  onLoad: function(options) {
    // 页面创建时执行
  },
  onShow: function() {
    // 页面出现在前台时执行
  },
  onReady: function() {
    // 页面首次渲染完毕时执行
  },
  onHide: function() {
    // 页面从前台变为后台时执行
  },
  onUnload: function() {
    // 页面销毁时执行
  },
  onPullDownRefresh: function() {
    // 触发下拉刷新时执行
  },
  onReachBottom: function() {
    // 页面触底时执行
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  onPageScroll: function() {
    // 页面滚动时执行
  },
  onResize: function() {
    // 页面尺寸变化时执行
  },
  onTabItemTap(item) {
    // tab 点击时执行
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // 事件响应函数
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function() {
      // this is setData callback
    })
  },
  // 自由数据
  customData: {
    hi: 'MINA'
  }
})
```

或者使用**Component**  注册复杂的页面



## 云开发

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

##### 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
=======