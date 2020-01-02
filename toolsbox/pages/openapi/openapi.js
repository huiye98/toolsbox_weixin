Page({

  data: {
    wxacodeSrc: '',
    wxacodeResult: '',
  },

  onGetWXACode() {

    this.setData({
      wxacodeSrc: '',
      wxacodeResult: '',
    })

    const fileID = "cloud://toolslbox-ymyjc.746f-toolslbox-ymyjc-1301022209/wxacode_default_openapi_page.jpeg"

    if (fileID) {
      // 有云文件 ID 缓存，直接使用该 ID
      this.setData({
        wxacodeSrc: fileID,
        wxacodeResult: `取得了小程序码的云文件 ID`,
      })
      console.log(`取得了小程序码的云文件 ID：${fileID}`)
    } else {
      wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'getWXACode',
        },
        success: res => {
          console.warn('[云函数] [openapi] wxacode.get 调用成功：', res)
          wx.showToast({
            title: '调用成功',
          })
          this.setData({
            wxacodeSrc: res.result,
            wxacodeResult: `云函数获取二维码成功`,
          })
          wx.setStorageSync('wxacodeCloudID', res.result)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [openapi] wxacode.get 调用失败：', err)
        }
      })
    }
  }
})

