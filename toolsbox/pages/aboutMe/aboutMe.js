// toolsbox/pages/aboutMe/aboutMe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxacodeSrc: '',
    wxacodeResult: '',
    imgAreaShow: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      wxacodeSrc: '',
      wxacodeResult: '',
    })
    const fileID = wx.getStorageSync('wxacodeCloudID')

    if (fileID) {
      this.setData({
        wxacodeSrc: fileID,
      })
      console.log(`从本地缓存中取得了小程序码的云文件 ID：${fileID}`)
    } else {
      wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'getWXACode',
        },
        success: res => {
          console.warn('[云函数] [openapi] wxacode.get 调用成功：', res)
          this.setData({
            wxacodeSrc: res.result,
          })
          wx.setStorageSync('wxacodeCloudID', res.result)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调取小程序码失败',
          })
          console.error('[云函数] [openapi] wxacode.get 调用失败：', err)
        }
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})