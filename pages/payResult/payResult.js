const api = require('../../config/api.js');
// pages/payResult/payResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.showShareMenu({
    //  withShareTicket: true
    // })
    var _this = this
      console.log(options.id)
      var id = options.id
    //请求刚完成支付的活动
    wx.request({
      url: `${api.promotion}${id}`,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('活动')
        console.log(res.data.data)
        _this.setData({
          result: res.data.data[0]
        })
      }
    })

  },

  tohome:function(){
      wx.switchTab({
        url: '../home/home',
      })
  },

  onShareAppMessage: function (res) {  
    return {
      title: '自定义转发标题',
      path: '/pages/payResult/payResult?id=123',
      imageUrl: '../../images/banner.jpg',
      success: function (res) {
        wx.showShareMenu({
          withShareTicket: true
        })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }

    }
  },

  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res)
  //   }
  //   return {
  //     title: '哈哈哈',
  //     path: '/pages/payResult/payResult?id=123',
  //     imageUrl: 'https://www.tosq20.cn/home/test/upload/1533395418c6c8.jpg'
  //     // success: (res) => {
  //     //   console.log("转发成功", res);
  //     // },
  //     // fail: (res) => {
  //     //   console.log("转发失败", res);
  //     // }
  //   }
  

  // },

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