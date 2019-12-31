// pages/index/index.js
var timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    displayText: "弹幕大军来袭",
    panelFlag: false,
    barFlag: true,
    colorIndex: 0,//白色
    speedIndex: 1,//正常速度
    sizeIndex: 1,//正常大小
    ScrollDuration: 5000,
    hintText: "点击空白处隐藏",
    textLen: 0,
    animation: {},
    currentSpeed: 0,
    is_paused:'running',
    sizeArr: [{
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
    speedArr: [
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
      // ,
      // {
      //   name: "停",
      //   value: 0,
      //   active: false
      // }
    ],
    colorArr: [{
      value: "#fff",
      active: true
    }, {
      value: "#f00",
      active: false
    }, {
      value: "#DA70D6",
      active: false
    }, {
      value: "#00FFFF",
      active: false
    }, {
      value: "#1E90FF",
      active: false
    }, {
      value: "#00FF00",
      active: false
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  /**
   * 查询字幕长度
   */
  getTextLen: function () {
    var query = wx.createSelectorQuery();
    query.select('.danmu').boundingClientRect((obj) => {
      this.setData({
        textLen: parseInt(obj.height)
      })
    }).exec();
  },
  /**
   * 清除字幕
   */
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
      after = 'colorArr[' + newIndex + '].active',
      before = 'colorArr[' + this.data.colorIndex + '].active';

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
      currentSpeed = this.data.windowHeight * 2 / this.data.speedArr[newIndex].value
    }
    var after = 'speedArr[' + newIndex + '].active',
      before = 'speedArr[' + this.data.speedIndex + '].active';
    this.setData({
      speedIndex: newIndex,
      currentSpeed,  //: this.data.windowHeight * 2 / this.data.speedArr[newIndex].value,
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
    var newIndex = parseInt(e.currentTarget.dataset.index),
      currentLen = this.data.textLen,
      after = 'sizeArr[' + newIndex + '].active',
      before = 'sizeArr[' + this.data.sizeIndex + '].active';

    this.setData({
      sizeIndex: newIndex,
      [before]: false,
      [after]: true
    })

    // 刷新
    this.updateScroll();
  },
  textInput: function (e) {

    this.clearScroll()

    this.setData({
      displayText: e.detail.value
    });


    this.updateScroll();
  },
  /**
   * 动画控制
   */
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
    var ScrollH = this.data.windowHeight * 2 + this.data.textLen;
    this.data.ScrollDuration = parseInt(ScrollH / this.data.currentSpeed);
    var ScrollAmt = () => {
      this.data.animation.translate3d(-ScrollH, 0, 0).step({
        duration: this.data.ScrollDuration
      })
      this.data.animation.translate3d(0, 0, 0).step({
        duration: 0
      })
      this.setData({
        Scroll: this.data.animation.export()
      })
    };
    ScrollAmt();
    // 循环动画
    timer = setInterval(() => {
      ScrollAmt();
      console.log(this.data.currentSpeed)
    }, this.data.ScrollDuration + 500);
  },
  setting: function () {
    if (this.data.barFlag) {
      this.setData({
        barAmt: 100,
        barFlag: false,
      })
    } else {
      this.setData({
        barAmt: 0,
        barFlag: true,
      })
    }
    if (this.data.panelFlag) {
      this.setData({
        panelAmt: 100,
        panelFlag: false
      })
    } else {
      this.setData({
        panelAmt: 0,
        panelFlag: true
      })
    }
  },
  toggleBar: function () {
    if (this.data.barFlag) {
      this.setData({
        barAmt: 100,
        barFlag: false,
        panelFlag: false,
        panelAmt: 100
      })
    } else {
      this.setData({
        barAmt: 0,
        barFlag: true,
        panelFlag: false,
        panelAmt: 100
      })
    }

  },
  focus: function () {
    this.setData({
      hintText: ""

    })
  },
  onblur: function () {
    var query = wx.createSelectorQuery()
    query.select('.inputtext')
    this.setData({
      hintText: "点击空白处隐藏"
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
    this.data.currentSpeed = this.data.windowHeight * 2 / this.data.speedArr[this.data.speedIndex].value;

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