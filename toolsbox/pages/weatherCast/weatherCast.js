// toolsbox/pages/weatherCast/weatherCast.js
let utils = require('../../utils/utils')
let globalData = getApp().globalData
const key = globalData.key
let SYSTEMINFO = globalData.systeminfo
Page({
  data: {
    isIPhoneX: globalData.isIPhoneX,
    message: '',
    cityDatas: {},
    weatherIconUrl: globalData.weatherIconUrl,
    detailsDic: {
      key: ['tmp', 'fl', 'hum', 'pcpn', 'wind_dir', 'wind_deg', 'wind_sc', 'wind_spd', 'vis', 'pres', 'cloud', ''],
      val: {
        tmp: '温度(℃)',
        fl: '体感温度(℃)',
        hum: '相对湿度(%)',
        pcpn: '降水量(mm)',
        wind_dir: '风向',
        wind_deg: '风向角度(deg)',
        wind_sc: '风力(级)',
        wind_spd: '风速(mk/h)',
        vis: '能见度(km)',
        pres: '气压(mb)',
        cloud: '云量',
      },
    },
    lifestyles: {
      'comf': '舒适度指数',
      'cw': '洗车指数',
      'drsg': '穿衣指数',
      'flu': '感冒指数',
      'sport': '运动指数',
      'trav': '旅游指数',
      'uv': '紫外线指数',
      'air': '空气污染扩散条件指数',
      'ac': '空调开启指数',
      'ag': '过敏指数',
      'gl': '太阳镜指数',
      'mu': '化妆指数',
      'airc': '晾晒指数',
      'ptfc': '交通指数',
      'fsh': '钓鱼指数',
      'spi': '防晒指数',
    },
    // 用来清空 input
    searchText: '',
    // 是否已经弹出
    hasPopped: false,
    // 是否切换了城市
    located: true,
    // 需要查询的城市
    searchCity: '',
    setting: {},
    bcgImgList: [{
        src: 'cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/images/weather-sunny-big.png', //晴
      },
      {
        src: 'cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/images/weather-pouring-big.png', //下雨
      },
      {
        src: 'cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/images/weather-snowy-big.png', //下雪
      },
      {
        src: 'cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/images/weather-cloudy-big.png', //多云
      },
      {
        src: 'cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/images/weather-fog-big.png', //雾
      },
      {
        src: 'cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/images/weather-yin-big.png', //阴
      },
      {
        src: 'cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/images/weather-cloudy-big.png', //默认多云
      },
    ],
    bcgImgIndex: 0,
    bcgImg: '',
    bcgImgAreaShow: false,
    bcgColor: '#018cf2',
    // 粗暴直接：移除后再创建，达到初始化组件的作用
    showHeartbeat: true,
    // heartbeat 时禁止搜索，防止动画执行
    enableSearch: true,
    shareInfo: {},
  },
  success(data, location) {
    this.setData({
      searchCity: location,
    })
    wx.stopPullDownRefresh()
    let now = new Date()
    // 存下来源数据
    data.updateTime = now.getTime()
    data.updateTimeFormat = utils.formatDate(now, "MM-dd hh:mm")
    wx.setStorage({
      key: 'cityDatas',
      data,
    })
    this.setData({
      cityDatas: data,
    })
  },
  fail(res) {
    wx.stopPullDownRefresh()
    let errMsg = res.errMsg || ''
    // 拒绝授权地理位置权限
    if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
      wx.showToast({
        title: '需要开启地理位置权限',
        icon: 'none',
        duration: 2500,
        success: (res) => {
          if (this.canUseOpenSettingApi()) {
            let timer = setTimeout(() => {
              clearTimeout(timer)
              wx.openSetting({})
            }, 2500)
          }
        },
      })
    } else {
      wx.showToast({
        title: '网络不给力，请稍后再试',
        icon: 'none',
      })
    }
  },
  commitSearch(res) {
    let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  },
  clearInput() {
    this.setData({
      searchText: '',
    })
  },
  search(val, callback) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
    if (val) {
      this.setData({
        located: true,
      })
      this.getWeather(val)
    }
    callback && callback()
  },
  // wx.openSetting 要废弃，button open-type openSetting 2.0.7 后支持
  // 使用 wx.canIUse('openSetting') 都会返回 true，这里判断版本号区分
  canUseOpenSettingApi() {
    let systeminfo = getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '2.0.7')
    if (version < 0) {
      return true
    } else {
      return false
    }
  },
  init(params, callback) {
    this.setData({
      located: true,
    })
    wx.getLocation({
      success: (res) => {
        this.getWeather(`${res.latitude},${res.longitude}`)
        callback && callback()
      },
      fail: (res) => {
        this.fail(res)
      }
    })
  },
  getWeather(location) {
    wx.request({
      url: `${globalData.requestUrl.weather}`,
      data: {
        location,
        key,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0]
          if (data.status === 'ok') {
            this.clearInput()
            this.success(data, location)
            if (data.now.cond_txt.indexOf('晴') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[0].src,
              })
            } else if (data.now.cond_txt.indexOf('雨') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[1].src,
              })
            } else if (data.now.cond_txt.indexOf('雪') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[2].src,
              })
            } else if (data.now.cond_txt.indexOf('云') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[3].src,
              })
            } else if (data.now.cond_txt.indexOf('雾') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[4].src,
              })
            } else if (data.now.cond_txt.indexOf('阴') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[5].src,
              })
            } else {
              this.setData({
                bcgImg: this.data.bcgImgList[6].src,
              })
            }
            this.setNavigationBarColor()
          } else {
            wx.showToast({
              title: '查询失败',
              icon: 'none',
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      },
    })
  },
  onPullDownRefresh(res) {
    this.reloadPage()
  },
  getCityDatas() {
    let cityDatas = wx.getStorage({
      key: 'cityDatas',
      success: (res) => {
        this.setData({
          cityDatas: res.data,
        })
        if (res.data.now.cond_txt.indexOf('晴') >= 0) {
          this.setData({
            bcgImg: this.data.bcgImgList[0].src,
          })
        } else if (res.data.now.cond_txt.indexOf('雨') >= 0) {
          this.setData({
            bcgImg: this.data.bcgImgList[1].src,
          })
        } else if (res.data.now.cond_txt.indexOf('雪') >= 0) {
          this.setData({
            bcgImg: this.data.bcgImgList[2].src,
          })
        } else if (res.data.now.cond_txt.indexOf('云') >= 0) {
          this.setData({
            bcgImg: this.data.bcgImgList[3].src,
          })
        } else if (res.data.now.cond_txt.indexOf('雾') >= 0) {
          this.setData({
            bcgImg: this.data.bcgImgList[4].src,
          })
        } else if (res.data.now.cond_txt.indexOf('阴') >= 0) {
          this.setData({
            bcgImg: this.data.bcgImgList[5].src,
          })
        } else {
          this.setData({
            bcgImg: this.data.bcgImgList[6].src,
          })
        }
        this.setNavigationBarColor()
      },
    })
  },
  setNavigationBarColor(color) {
    let bcgColor = this.data.bcgColor
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: bcgColor,
    })
  },
  menuMainMove(e) {
    // 如果已经弹出来了，需要先收回去，否则会受 top、left 会影响
    if (this.data.hasPopped) {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
    let windowWidth = SYSTEMINFO.windowWidth
    let windowHeight = SYSTEMINFO.windowHeight
    let touches = e.touches[0]
    let clientX = touches.clientX
    let clientY = touches.clientY
    // 边界判断
    if (clientX > windowWidth - 40) {
      clientX = windowWidth - 40
    }
    if (clientX <= 90) {
      clientX = 90
    }
    if (clientY > windowHeight - 40 - 60) {
      clientY = windowHeight - 40 - 60
    }
    if (clientY <= 60) {
      clientY = 60
    }
    let pos = {
      left: clientX,
      top: clientY,
    }
    this.setData({
      pos,
    })
  },
  reloadWeather() {
    if (this.data.located) {
      this.init({})
    } else {
      this.search(this.data.searchCity)
      this.setData({
        searchCity: '',
      })
    }
  },
  onShow() {

  },
  onLoad() {
    this.reloadPage()
  },
  reloadPage() {
    // this.setBcgImg()
    this.getCityDatas()
    this.reloadInitSetting()
    this.reloadWeather()
    this.reloadGetBroadcast()
  },
  checkUpdate(setting) {
    // 兼容低版本
    if (!setting.forceUpdate || !wx.getUpdateManager) {
      return
    }
    let updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      console.error(res)
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已下载完成，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  initSetting(successFunc) {
    wx.getStorage({
      key: 'setting',
      success: (res) => {
        let setting = res.data || {}
        this.setData({
          setting,
        })
        successFunc && successFunc(setting)
      },
      fail: () => {
        this.setData({
          setting: {},
        })
      },
    })
  },
  reloadInitSetting() {
    this.initSetting((setting) => {
      this.checkUpdate(setting)
    })
  },
  searchHide() {
    if (this.data.hasPopped) {
      console.log("收")
      this.setData({
        hasPopped: false,
      })
    }
  },
  searchMain() {
    if (!this.data.hasPopped) {
      console.log("放")
      this.setData({
        hasPopped: true,
      })
    } else {
      console.log("收")
      this.setData({
        hasPopped: false,
      })
    }
  }
})