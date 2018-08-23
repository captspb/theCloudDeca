// pages/phoneTip/phoneTip.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  getPhoneNumber: function (e) {

    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var sessionk = wx.getStorageSync('session_key')
    var token = wx.getStorageSync('token')

    app.globalData.ency = e.detail.ency
    this.setData({
      hasPhoneNumber: true
    })

    console.log('ency:' + ency)
    console.log('iv:' + iv)
    console.log('sessionk:' + sessionk)
    console.log('token:' + token)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.navigateBack({ changed: true });
      wx.request({
        method: "POST",
        url: 'https://www.tosq20.cn/api/api/user/deciphering',
        data: {
          encrypdata: ency,
          ivdata: iv,
          sessionkey: sessionk
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Token': token
        },
        success: (res) => {
          console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
          console.log(res.data.data.data);
          var phone = JSON.parse(res.data.data.data).phoneNumber;
          console.log(phone);

        }, fail: function (res) {
          console.log("解密失败~~~~~~~~~~~~~");
          console.log(res);
        }
      });
    }
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