// pages/index/index.js
var timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    displayText: "弹幕来袭",
    show_selects: false,
    show_setting: true,
    colorIndex: 1,//白色
    speedIndex: 1,//正常速度
    sizeIndex: 1,//正常大小
    duration: 5000,
    hintText: "点击空白处隐藏",
    textLen: 0,
    animation: {},
    currentSpeed: 0,
    is_paused:'running',
    userInput:'',
    sizelist: [{
      name: "小",
      value: 25,
      class:'small',
      active: false
    },
    {
      name: "正常",
      value: 40,
      class: 'normal',
      active: true
    },
    {
      name: "大",
      value: 60,
      class:'big',
      active: false
    }, {
      name: "超大",
      value: 80,
      class:'superbig',
      active: false
    }],
    speedlist: [
    {
      name: "慢",
      value: 7000,
      active: false
    }, 
    {
      name: "正常",
      value: 5000,
      active: true
    },
    {
      name: "快",
      value: 3000,
      active: false
      }
    ],
    colorlist: [{
      value: "#fff",
      active: false
    }, {
      value: "#f00",
        active: true
    }, {
      value: "#DA70D6",
      active: false
    }, {
      value: "#00FFFF",
      active: false
    }, {
      value: "#0000FF",
      active: false
    }, {
      value: "#00FF00",
      active: false
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //捕获页面高度，用于计算滚动速度
  onLoad: function () {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  //计算文本长度，从而计算速度
  getTextLen: function () {
    var query = wx.createSelectorQuery();
    query.select('.danmu').boundingClientRect((obj) => {
      this.setData({
        textLen: parseInt(obj.height)
      })
    }).exec();
  },
  
  // 清屏
  clearScroll: function () {
    clearInterval(timer);
    this.data.animation.translate3d(0, 0, 0).step({
      duration: 0
    })
    this.setData({
      Scroll: this.data.animation.export()
    })
  },

  /**
   * 改变字体颜色
   */
  changeColor: function (e) {
    var newIndex = parseInt(e.currentTarget.dataset.index),
      after = 'colorlist[' + newIndex + '].active',
      before = 'colorlist[' + this.data.colorIndex + '].active';

    this.setData({
      colorIndex: newIndex,
      [before]: false,
      [after]: true
    })
  },

  /**
   * 改变速度
   */
  changeSpeed: function (e) {
    var newIndex = parseInt(e.currentTarget.dataset.index);
    var currentSpeed = 0
    if(newIndex!=3){
      //用户点击停止
      this.clearScroll()
      currentSpeed = this.data.windowHeight * 2 / this.data.speedlist[newIndex].value
    }
    var after = 'speedlist[' + newIndex + '].active',
      before = 'speedlist[' + this.data.speedIndex + '].active';
    this.setData({
      speedIndex: newIndex,
      currentSpeed,  //: this.data.windowHeight * 2 / this.data.speedlist[newIndex].value,
      [before]: false,
      [after]: true
    })

    this.updateScroll();
  },

  /**
   * 改变字体大小
   */
  changeSize: function (e) {
    this.clearScroll()
    // 先设置大小
    var cindex = parseInt(e.currentTarget.dataset.index),
      currentLen = this.data.textLen,
      after = 'sizelist[' + cindex + '].active',
      before = 'sizelist[' + this.data.sizeIndex + '].active';

    this.setData({
      sizeIndex: cindex,
      [before]: false,
      [after]: true
    })

    // 重新滚动
    this.updateScroll();
  },
  textInput: function (e) {

    this.clearScroll()
  //这里好像删不掉输入的字符，不然会触发value change的事件
    this.setData({
      displayText: e.detail.value
    });
    this.updateScroll();
    this.clearinput()
  },
  
  //更新滚动
  updateScroll: function () {
    // if (this.data.currentSpeed==0){
    //   clearInterval(timer);
    //   var query = wx.createSelectorQuery();
    //   // this.setData({
    //   //   is_paused: paused
    //   // }) 
    //   // // var danmu = query.select('.danmu')
    //   // // var container = query.select('.container')
    //   // // var iTransform = window.getComputedStyle(danmu).transform;
    //   // // var cTransform = window.getComputedStyle(container).transform;
    //   // // container.style.transform = cTransform === 'none'
    //   //   ? iTransform
    //   //   : iTransform.concat(' ', cTransform);
    //   //   // image.classList.remove('animate');
    //   //   danmu.classList.remove('animate');
        
    //   // query.select('.danmu').style.animationPlayState ="paused"
    //   return;
    // }
    this.getTextLen();
    var sheight = this.data.windowHeight *2 + this.data.textLen;
    this.data.duration = parseInt(sheight / this.data.currentSpeed);
    var singleScroll = () => {
      //滚过去
      this.data.animation.translate3d(-sheight, 0, 0).step({
        duration: this.data.duration
      })
      //滚回来
      this.data.animation.translate3d(0, 0, 0).step({
        duration: 0
      })
      this.setData({
        Scroll: this.data.animation.export()
      })
    };
    singleScroll();
    // 循环动画
    timer = setInterval(() => {
      singleScroll()
    }, this.data.duration);
  },
  setting: function () {
    if (this.data.show_setting) {
      this.setData({
        settingY: 100,
        show_setting: false,
      })
    } else {
      this.setData({
        settingY: 0,
        show_setting: true,
      })
    }
    if (this.data.show_selects) {
      this.setData({
        selectsY: 100,
        show_selects: false
      })
    } else {
      this.setData({
        selectsY: 0,
        show_selects: true
      })
    }
  },
  switchbar: function () {
    if (this.data.show_setting) {
      this.setData({
        settingY: 100,
        show_setting: false,
        show_selects: false,
        selectsY: 100
      })
    } else {
      this.setData({
        settingY: 0,
        show_setting: true,
        show_selects: false,
        selectsY: 100
      })
    }

  },
  //回车后消除input内容
  clearinput:function(e){
    this.setData({
      userInput: ''
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var animation = wx.createAnimation({
      timingFunction: 'linear'
    });
    this.data.animation = animation;

    //初始化速度
    this.data.currentSpeed = this.data.windowHeight * 2 / this.data.speedlist[this.data.speedIndex].value;

    this.updateScroll();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})