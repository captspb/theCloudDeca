const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp()

var ss = app.globalData.promotion_ids
var title = "帅威橱柜"
// pages/home/home.js
var promote_id
var promotion_ids = []
var phoneNumber_2 = undefined
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadPhoneNumber :0,
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
    console.log(ss)

    wx.showLoading({
      title: '加载中',
    })
    var _this = this
    var token = wx.getStorageSync('token')

  
    //获取logo
    wx.request({
      url: api.logo,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res.data.data.forEach(function (item) {
          item.value = `${api.baseUrl}${item.value}`
        })
        console.log(res.data.data[0].value)
        _this.setData({
          logo_url: res.data.data[0].value
        })
      }
    })  

    //获取banner
    wx.request({
      url: api.banner,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res.data.data.forEach(function (item) {
          item.value = `${api.baseUrl}${item.value}`
        })
        _this.setData({
          banners: res.data.data
        })
      }
    })  
    //获取商户门店信息
    wx.request({
      url: api.merchantInfo,
      success: function (res) {
        console.log(res.data.data[0])
        var merchant_name = res.data.data[0].merchant_name
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
          longitude: lng,
          merchant_name: merchant_name
          
        })

        wx.setNavigationBarTitle({
          title: merchant_name
        })
      }
    })  
    //获取活动
   
    wx.request({
      url: api.promotions,
      header: {
        'Accept': 'application/json'
      },      
      success: function (res) {
        console.log('活动')
       
        console.log(res.data.data)
        res.data.data.forEach(function(item){
          promotion_ids.push(item.id)
        })

        app.globalData.promotion_ids = promotion_ids
        console.log(promotion_ids)
        console.log(app.globalData.promotion_ids)

        _this.setData({
          coupons: res.data.data
        })

      }
    })  
    //获取最新n条案例
    wx.request({
      url: api.caseListN,
      success: function (res) {
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
         
       }) 
        _this.setData({
          remarksData:res.data.data
        })
      }
    })  
   
  },

  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;//获取当前图片下标
    var srcs = e.currentTarget.dataset.srcs;
    console.log(current)
    console.log(srcs)
    var urls =[]
    srcs.forEach(function(item){
        var url = item.img_url
        urls.push(url)
    })

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  showMap: function(){
    // wx.navigateTo({
    //   url: `../map/map?lat=${this.data.latitude}&&lng=${this.data.longitude}`
    // })

    var latitude = Number(this.data.latitude)
    var longitude = Number(this.data.longitude)

    console.log(latitude)
    console.log(longitude)

    var address = this.data.address

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图定位功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");

              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      wx.openLocation({
                        latitude: latitude,
                        longitude: longitude,
                        name: address,
                        scale: 15
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name: address,
            scale: 15
          })
        }
      }
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
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var sessionk = wx.getStorageSync('session_key')
    var token = wx.getStorageSync('token')
    app.globalData.ency = e.detail.ency
    this.setData({
      cfmNoPhone: 0
    })
    
    this.setData({
      hasPhoneNumber: true
    })
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权无法支付',
        success: function (res) { }
      })
    } else {
      app.globalData.phoneNumber = 1
      phoneNumber_2 =1
     this.setData({
       hadPhoneNumber:1
     })
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
         var phone = JSON.parse(res.data.data.data).phoneNumber;
       }, fail: function (res) {
      
       }
     });
    }
  },
  onPay:function(e){
    promote_id = e.currentTarget.dataset.id 
    var campaign = app.globalData.campaign
    var total_fee = e.currentTarget.dataset.deposit
    var type = e.currentTarget.dataset.type
    var description = e.currentTarget.dataset.description
    var grouper = e.currentTarget.dataset.grouper
    var left = description - grouper
    var token = wx.getStorageSync('token')
    var that = this  
    var phoneNumber = app.globalData.phoneNumber
   
    if (phoneNumber){
      if (type==2) { 
        if (campaign[promote_id]){
          wx.showToast({
            title: '已支付',
            icon: 'none',
            duration: 2000
          })
        }
        else if(left==0){
          wx.showToast({
            title: '组团已满',
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showModal({
            title: '提示',
            content: '支付定金后即可组团，点击确定支付',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.request({
                  url: 'https://www.tosq20.cn/api/api/campaignDetail/save',
                  method: 'POST',
                  header: {
                    'Accept': 'application/json',
                    'Token': token
                  },
                  data: {
                    total_fee: total_fee,
                    type_id: promote_id,
                    product_id: 1,
                    remark: '好'
                  },
                  success: function (res) {
                    console.log(res)
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
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }  
          
      } else if (type == 1 && campaign[promote_id]){   
          wx.showToast({
            title: '已支付',
            icon: 'none',
            duration: 2000
          })
        } else{
        wx.request({
          url: 'https://www.tosq20.cn/api/api/campaignDetail/save',
          method: 'POST',
          header: {
            'Accept': 'application/json',
            'Token': token
          },
          data: {
            total_fee: total_fee,
            type_id: promote_id,
            product_id: 1,
            remark: '好'
          },
          success: function (res) {
            console.log(res)
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
        
      }
    }else {
      that.setData({
        cfmNoPhone:1
      })
      console.log('没有授权手机号')
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

        wx.navigateTo({
          url: `../payResult/payResult?id=${promote_id}`
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
    wx.hideLoading()  

    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


    //获取活动
    wx.request({
      url: api.promotions,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('活动')
        console.log(res.data.data)
        _this.setData({
          coupons: res.data.data
        })
      }
    })  
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