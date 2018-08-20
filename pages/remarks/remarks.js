var util = require('../../utils/util.js');
const api = require('../../config/api.js');


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
    //获取评价
    var _this = this
    wx.request({
      url: api.EvaluateList,
      success: function (res) {
        console.log(res.data.data)
        res.data.data.forEach(function (item) {
          item.pic_list.forEach(function (t) {
            t.img_url = `${api.baseUrl}${t.img_url}`
          })
        })
        res.data.data.forEach(function (item) {
          var score = item.score
          var time = item.create_time  
          var remark_stars = []
          for (var i = 0; i < score; i++) {
            remark_stars.push('1')
          }
          item.score = remark_stars
          var date = util.formatTime(new Date(time))
          item.create_time = date
        })
        
        _this.setData({
          remarksData: res.data.data
        })
      }
    })  
    
    
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