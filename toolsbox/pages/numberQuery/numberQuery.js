// miniprogram/pages/numberQuery/numberQuery.js
const app = getApp()

Page({
  data: {
    number: "",
    region: "",
    city: "",
    operator: "",
    area: "",
    post: "",
    queryResult: false,
    msg: null,
    disabled: true
  },
  onLoad: function(options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: "#00b26a",
    })
  },
  onInputChange: function(e) {
    if (e.detail.value.length !== 11) {
      this.setData({
        msg: "输入提示：手机号长度应为11位数字",
        queryResult: false,
        disabled: true
      })
    } else {
      this.setData({
        msg: null,
        number: parseInt(e.detail.value.substr(0, 7)), //得到号码的前七位
        disabled: false,
      })
    }
  },

  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    console.log("clicked query")
    db.collection('numbers').where({
      ndc_sn_from: this.data.number
    }).get({
      success: res => {
        this.setData({
          queryResult: true,
          city: res.data[0].city,
          region: res.data[0].origin,
          operator: res.data[0].operator,
          area: res.data[0].city_code,
          post: res.data[0].post_code,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }




  //   /**
  //    * 页面的初始数据
  //    */
  //   data: {

  //   },

  //   /**
  //    * 生命周期函数--监听页面加载
  //    */


  //   /**
  //    * 生命周期函数--监听页面初次渲染完成
  //    */
  //   onReady: function () {

  //   },

  //   /**
  //    * 生命周期函数--监听页面显示
  //    */
  //   onShow: function () {

  //   },

  //   /**
  //    * 生命周期函数--监听页面隐藏
  //    */
  //   onHide: function () {

  //   },

  //   /**
  //    * 生命周期函数--监听页面卸载
  //    */
  //   onUnload: function () {

  //   },

  //   /**
  //    * 页面相关事件处理函数--监听用户下拉动作
  //    */
  //   onPullDownRefresh: function () {

  //   },

  //   /**
  //    * 页面上拉触底事件的处理函数
  //    */
  //   onReachBottom: function () {

  //   },

  //   /**
  //    * 用户点击右上角分享
  //    */
  //   onShareAppMessage: function () {

  //   }
  // })({

  //   /**
  //    * 页面的初始数据
  //    */
  //   data: {

  //   },

  //   /**
  //    * 生命周期函数--监听页面加载
  //    */
  //   onLoad: function (options) {

  //   },

  //   /**
  //    * 生命周期函数--监听页面初次渲染完成
  //    */
  //   onReady: function () {

  //   },

  //   /**
  //    * 生命周期函数--监听页面显示
  //    */
  //   onShow: function () {

  //   },

  //   /**
  //    * 生命周期函数--监听页面隐藏
  //    */
  //   onHide: function () {

  //   },

  //   /**
  //    * 生命周期函数--监听页面卸载
  //    */
  //   onUnload: function () {

  //   },

  //   /**
  //    * 页面相关事件处理函数--监听用户下拉动作
  //    */
  //   onPullDownRefresh: function () {

  //   },

  //   /**
  //    * 页面上拉触底事件的处理函数
  //    */
  //   onReachBottom: function () {

  //   },

  //   /**
  //    * 用户点击右上角分享
  //    */
  //   onShareAppMessage: function () {

  //   }
})