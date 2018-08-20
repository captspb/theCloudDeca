const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp()
var title = "帅威橱柜"
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadPhoneNumber :1,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    taken:'',
    selectedCase:[],
    remarksData:[],
    banners: [
      "../../images/banner.jpg",
      "../../images/banner.jpg",
      "../../images/banner.jpg"
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,


  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var _this = this
    var token = wx.getStorageSync('token')
    console.log('token:'+token)
    //获取商户门店信息
    wx.request({
      url: api.merchantInfo,
      success: function (res) {
        console.log(res.data.data[0])
        var main_business = res.data.data[0].main_business
        var address = res.data.data[0].address
        var phone_no = res.data.data[0].phone_no
        var lat = res.data.data[0].lat
        var lng = res.data.data[0].lng    
        _this.setData({
          main_business: main_business,
          address: address,
          phone_no: phone_no,
          latitude: lat,
          longitude: lng
        })
      }
    })  

    //获取活动
    wx.request({
      url:'https://www.tosq20.cn/api/api/campaigntype/list?merchant_id=15',
      header: {
        'Accept': 'application/json',
        'Token': token
      },      
      success: function (res) {
        console.log(res.data.data)    
        _this.setData({
          coupons: res.data.data
        })
      }
    })  


    //获取最新n条案例
    wx.request({
      url: api.caseListN,
      success: function (res) {
        console.log(res.data.data)
        res.data.data.forEach(function (item) {
          item.img_url = `${api.baseUrl}${item.img_url}`
        })
        _this.setData({
          selectedCase: res.data.data
        })
      }
    })  

    //获取最新n条评价
    wx.request({
      url: api.EvaluateN,
      success: function (res) {
        console.log(res.data.data)
       res.data.data.forEach(function (item) {
         item.pic_list.forEach(function(t){
           t.img_url = `${api.baseUrl}${t.img_url}`
         })
       })

       res.data.data.forEach(function (item) {
         var score = item.score
         var time =item.create_time    
         var remark_stars = []
         for (var i = 0; i < score; i++) {
           remark_stars.push('1')
         }
         item.score = remark_stars
         var date = util.formatTime(new Date(time))
         item.create_time = date
         console.log(date)
         
       })

       console.log(res.data.data)
        _this.setData({
          remarksData:res.data.data
        })
      }
    })  


    console.log(title)
    var thetitle = `云装无忧-${title}`  

    wx.setNavigationBarTitle({
      title: thetitle//页面标题为路由参数
    })
  },
  showMap: function(){
    wx.navigateTo({
      url: `../map/map?lat=${this.data.latitude}&&lng=${this.data.longitude}`
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      token: true
    })
    wx.showTabBar()
    wx.login({
      success: function (res) {
        var code = res.code;//发送给服务器的code  
        console.log('code:' + res.code)
        if (code) {
          //发起网络请求         
          wx.request({
            url: api.auth,
            method: "POST",
            dataType: "application/json",
            data: {
              code: code,
              merchant_id: api.merchant_id
            },
            success: function (res) {
            
              console.log(res.data)
              var userId = JSON.parse(res.data).data.userId
              var token = JSON.parse(res.data).data.token
              wx.setStorage({
                key: "userId",
                data: userId
              })
              wx.setStorage({
                key: "token",
                data: token
              })

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })

  },

  toCaseDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../caseDetail/caseDetail?id=${id}`
    })
  },

  call:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone_no //仅为示例，并非真实的电话号码
    })
  },

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { }
      })
    }
  },

  onPay:function(e){
    var id = e.currentTarget.dataset.id
    var total_fee = e.currentTarget.dataset.deposit
    var type = e.currentTarget.dataset.type

    console.log('id:'+id)
    console.log('fee:' + total_fee)
    console.log('type:' + type)
    var token = wx.getStorageSync('token')
    console.log('1111')
    console.log(token)
    if (token) {    
    var that = this  
        wx.request({
          url: 'https://www.tosq20.cn/api/api/pay/prepay',
          method: 'POST',
          header: {
            'Accept': 'application/json',
            'Token': token
          },
          data: {
            //传递生成订单要用到的参数
            // wechat_no:'lh18077025201' ,
               total_fee: total_fee,
               campaign_id: id,
               group_code: 's2ybd2vnb6'
          },
          success: function (res) {
            console.log(res.data)
            var timeStamp = res.data.data.timeStamp //时间戳
            var nonceStr = res.data.data.nonceStr  //随机数
            var packages = res.data.data.package   //prepay_id
            var paySign = res.data.data.paySign   //签名
            var signType = 'MD5'

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
  }else{
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

   
    //获取最新n条评价
    var _this = this
    wx.request({
      url: api.EvaluateN,
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