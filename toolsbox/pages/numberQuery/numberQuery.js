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
    disabled: true,
    countryCodes: ["+86", "+1"],
    region_name:["省份","州"],
    countryCodeIndex: 0,
  },
  onLoad: function(options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: "#00b26a",
    })
  },

  onCountryCodeChange: function(e) {
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  onInputChange: function(e) {
    if (this.data.countryCodeIndex==0 && e.detail.value.length !== 11) {
      this.setData({
        msg: "输入提示：手机号长度应为11位数字",
        queryResult: false,
        disabled: true
      })
    } else if (this.data.countryCodeIndex ==1 && e.detail.value.length !== 10){
      this.setData({
        msg: "输入提示：手机号长度应为10位数字",
        queryResult: false,
        disabled: true
      })
    } 
    else {
      this.setData({
        msg: null,
        number: e.detail.value, //得到号码的前七位
        disabled: false,
      })
    }
  },

  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    console.log("clicked query")
    if(this.data.countryCodeIndex == 0){
      db.collection('numbers').where({
        ndc_sn_from: parseInt(this.data.number.substr(0, 7))
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
    }else{
      const _ = db.command
      const start = parseInt(this.data.number.substr(3, 4))
      // console.log(start*1000)
      db.collection('usa_numbers').where(
        {
          ndc: parseInt(this.data.number.substr(0, 3)),
          ndc_sn_from:start*1000
        }
      ).get({
        success: res => {
          console.log(res)
          this.setData({
            queryResult: true,
            city: res.data[0].city,
            region: res.data[0].region,
            operator: res.data[0].operator,
            area: "",
            post: "",
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
    
  }
})