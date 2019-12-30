// toolsbox/pages/drawLots/drawLots.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 1,
    max: 100,
    select: 1,
    putback: false,//默认不放回
    result: null,
    theme: "抽签结果如下"
  },

  themeChange: function (e) {
    this.setData({
      theme: e.detail.value
    })
  },
  selectChange: function (e) {
    this.setData({
      select: e.detail.value
    })
  },
  minChange: function (e) {
    this.setData({
      min: e.detail.value
    })
  },
  maxChange: function (e) {
    this.setData({
      max: e.detail.value
    })
  },
  switchChange: function (e) {
    this.setData({
      putback: e.detail.value//true不放回，false放回
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            result: errors[firstError[0]].message
          })
        }
      } else {
        var res = [],
          min = this.data.min,
          max = this.data.max,
          select = this.data.select,
          putback = this.data.putback
        while (select !== 0) {
          var random = parseInt(Math.random() * (max - min + 1) + min) + 1
          if (putback) {
            res.push(random)
            select -= 1
          }
          if (!putback && res.indexOf(random) == -1) {
            res.push(random)
            select -= 1
          }
        }
        console.log(res)
        this.setData({
          result: res
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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