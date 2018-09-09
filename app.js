//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // var token = wx.getStorageSync('token')
    // console.log(token)
   var _this = this
    // 登录
    wx.login({
      success: function (res) {
        var code = res.code;//发送给服务器的code        
        if (code) {
          //发起网络请求         
          wx.request({
            url: 'https://www.tosq20.cn/api/api/auth/login_by_weixin',
            method: "POST",
            dataType: "application/json",
            data: {
              code: code,
              merchant_id: 15
            },
            success: function (res) {
              console.log(res.data)
              var userId = JSON.parse(res.data).data.userId
              var token = JSON.parse(res.data).data.token
              var openid = JSON.parse(res.data).data.openid
              var session_key = JSON.parse(res.data).data.session_key
              _this.globalData.phoneNumber = JSON.parse(res.data).data.gethone
              _this.globalData.order_no = JSON.parse(res.data).data.order_no
              _this.globalData.campaign = JSON.parse(res.data).data.campaign
              wx.setStorage({
                key: "userId",
                data: userId
              })
              wx.setStorage({
                key: "token",
                data: token
              })
              wx.setStorage({
                key: "openid",
                data: openid
              })
              wx.setStorage({
                key: "session_key",
                data: session_key
              })

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo:null,
    promotion_ids:null,
    phoneNumber:null,
    order_no: null,
    campaign:null,
    
  }
  

})