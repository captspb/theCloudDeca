const util = require('../../utils/util.js');
const api = require('../../config/api.js');

var theProduct = {
  name: "实木多层板",
  url: "../../images/banner.jpg",
  price: 30,
  oldPrice: 58,
  tags: [
    {
      tagName: "多层木dd"
    },
    {
      tagName: "特价ff"
    }
  ],
  desc: "四号公路和刚开始历史的回顾i获得过，李赛贷后管理赛后过来撒获得广大干部你，里算个礼俗和管理萨格吧"
}
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
    var id = options.id
    console.log('id:' + id)
    var _this = this
    //请求产品详情
    wx.request({
      url: `${api.proDetail}${id}`,
      success: function (res) {
        console.log(res.data.data)

        res.data.data.forEach(function (item) {
          item.img_url = `${api.baseUrl}${item.img_url}`
          item.tag = item.tag.split(',')
        })

        _this.setData({
          product: res.data.data[0]
        })
      }
    })


  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '18077025201' //仅为示例，并非真实的电话号码
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