// toolsbox/pages/tomatoTimer/tomatoTimer.js
const hours = []
const minutes = []

for (let i = 0; i < 24; i++) {
  hours.push(i)
}

for (let i = 1; i <= 59; i++) {
  minutes.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hours: hours,
    hour: 0,
    minutes: minutes,
    minute: 0,
    value: [0,1],
    showlist:[
      {
        id: 'select-bar',
        show:false
      },
      {
        id: 'tomatotimer',
        show:false
      }
    ],
    showIndex:1,//true为显示倒计时界面，false为设置倒计时长
    nowtime:"00:00:00",
    seconds:0,
    timer:''
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      hour: this.data.hours[val[0]],
      minute: this.data.minutes[val[1]],
      seconds: this.data.hours[val[0]] * 3600 + this.data.minutes[val[1]]*60
    })
  },
  setTime: function () {
    var seconds = this.data.seconds
    var hour = parseInt(seconds / 3600)
    var minute = parseInt((seconds - 3600 * hour) / 60)
    var second = seconds % 60
    if (hour < 10)
      hour = '0' + hour
    if (minute < 10)
      minute = "0" + minute
    if (second < 10)
      second = '0' + second
    this.setData({
      nowtime: hour + ":" + minute + ":" + second
    })
  },
  changeTime:function(){
    if (this.data.showIndex == 0 || this.data.seconds==0){
      clearInterval(this.data.timer)
      this.setData({
        nowtime: "00:00:00"
      })
      return;
    }
    this.setTime()
    var self = this;
    var time = self.data.seconds
    self.setData({
      timer:setInterval(()=>{
        time--;
        self.setData({
          seconds:time
        });
        self.setTime(self)
        if (time==0){
          clearInterval(self.data.timer)
        }
      },1000)
    })
  },
  selectTime: function (e) {
    var query = wx.createSelectorQuery()
    var index = this.data.showIndex
    var before = 'showlist[' + index + '].show'
    index = (this.data.showIndex + 1) % 2
    var after = 'showlist[' + index + '].show'
    this.setData({
      showIndex: index,
      [before]: false,
      [after]: true
    })
    this.changeTime();
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