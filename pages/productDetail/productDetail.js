const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
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

          item.pic_list.forEach(function(t){
            t.img_url = `${api.baseUrl}${t.img_url}`
          })
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
  onPay: function (e) {
    console.log(this.data.product)
    var id = this.data.product.id
    var total_fee = this.data.product.vip_price
    var token = wx.getStorageSync('token')
   
    if (token) {
      var that = this
      wx.request({
        url: 'https://www.tosq20.cn/api/api/order/buy',
        method: 'POST',
        header: {
          'Accept': 'application/json',
          'Token': token
        },
        data: {
          total_fee: total_fee,
          product_id: id  
        },
        success: function (res) {
          console.log(res.data)
          var timeStamp = res.data.data.timeStamp //时间戳
          var nonceStr = res.data.data.nonceStr  //随机数
          var packages = res.data.data.package   //prepay_id
          var paySign = res.data.data.paySign   //签名
          var signType = 'MD5'
          var group_code = res.data.data.group_code   //group_code

          var param = {
            "timeStamp": timeStamp,
            "package": packages,
            "paySign": paySign,
            "signType": "MD5",
            "nonceStr": nonceStr
          }
          that.pay(param);
        }
      })
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },

  pay: function (param) {
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': param.signType,
      'paySign': param.paySign,
      success: function (res) {
        console.log(res)
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面  
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            //支付成功之后将订单状态修改为已支付
            // wx.request({
            //   url: 'localhost:8080/changeOrderState',
            //   method: 'POST',
            //   header: { "Content-Type": "application/x-www-form-urlencoded" },
            //   data: {
            //     msg: '用户已成功支付，修改订单状态'
            //   },
            //   success: function (res) {
            //     console.log('修改完成')
            //     //引导用户查看订单
            //   },
            //   fail: function (err) {
            //   }
            // })
          },
          fail: function () {
          },
          complete: function () {
          }
        })
      },
      fail: function () {
        console.log("支付失败")
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