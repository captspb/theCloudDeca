// pages/remark/remark.js
const app = getApp()
var util = require('../../utils/util.js'); 
const api = require('../../config/api.js');
var src = [];
var starNum = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toDelete:0,
    stars:[
      {
        url:"../../images/none-star.png"
      },
      {
        url: "../../images/none-star.png"
      },
      {
        url: "../../images/none-star.png"
      },
      {
        url: "../../images/none-star.png"
      },
      {
        url: "../../images/none-star.png"
      }
    ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // wx.showModal({
    //   title: '提示',
    //   content: '为保证点评真实性，您付完定金后，才可参与点评！',
    //   cancelText:"返回首页",
    //   confirmText:"前去支付",
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       wx.requestPayment({
    //         'timeStamp': '',
    //         'nonceStr': '',
    //         'package': '',
    //         'signType': 'MD5',
    //         'paySign': '',
    //         'success': function (res) {
    //         },
    //         'fail': function (res) {
    //         }
    //       })
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //       wx.switchTab({
    //         url: '../home/home',
    //       })
    //     }
    //   }
    // })
  },
  getUserInfo: function (e) {
   var _this = this
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
         console.log(111)
          _this.setData({
            not_auth:1
          })
        }
      }
    })


  },

  tapStar: function (e) {
    var index = e.currentTarget.dataset.index;
    starNum = index+1;
    for (var i = 0; i <= 4; i++) {
    
      if(i <=index){
        this.data.stars[i].url = "../../images/star.png"
      }else{
        this.data.stars[i].url = "../../images/none-star.png"
      }     

    }
    this.setData({
        stars:this.data.stars      
    })
   
  },
  chooseImage: function(){
    var _this = this;
    var currenSrcLen = src.length
    if(src.length<6) {
    wx.chooseImage({
      count: 6-currenSrcLen, 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log('tempFilePaths:'+ tempFilePaths)

          tempFilePaths.forEach(function(item){
            src.push(item);
          }) 
        console.log(src)
        _this.setData({
          src: src
        })
      }
    })
    }else{
      wx.showToast({
        title: '最多上传6张图片',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  previewImage:function(e){
    var current = e.currentTarget.dataset.src;//获取当前图片下标
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.src // 需要预览的图片http链接列表
    })
  },

  deleteImage: function(e){
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    var _this = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          src.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        _this.setData({
          src:src
        });
      }
    })
  },

  formSubmit: function (e) {
    var order_no = app.globalData.order_no
    var name = '匿名'
    var avatarUrl = '../../images/icon/user.png'
    var token = wx.getStorageSync('token')
    console.log('评论')
    var remarkText = e.detail.value.remarkText
    if (this.data.userInfo){
      name = this.data.userInfo.nickName
      avatarUrl = this.data.userInfo.avatarUrl
    }
    
    console.log('头像'+ avatarUrl)
    var _this = this

    if (order_no){

   

   if(starNum&&remarkText&&avatarUrl){
     console.log(remarkText)
     console.log(remarkText.length)
     if (remarkText.length>=30){   
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        var userId = res.data  
        wx.showLoading({
          title: '上传评论中',
        })

//有图片时发表评论
        if(src.length>0){             
          console.log('youtupian')
        var imgId = []
        //上传评论图片
        for (var i = 0, h = src.length; i < h; i++) {
          wx.uploadFile({
            url: 'https://www.tosq20.cn/api/api/upload/local',
            filePath: src[i],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (res) {    
              var id = JSON.parse(res.data).data.id
              imgId.push(id)                    
              if (imgId.length==src.length) {
                var theIds = []
                function newId(id) {        
                  this.id=id
                }
                imgId.forEach(function (item) {
                  theIds.push(new newId(item))
                })

                //发表评论
                wx.request({
                  url: api.Evaluate,
                  method: "POST",
                  header: {
                    'Accept': 'application/json',
                    'Token': token
                  },               
                  data: {
                    merchant_id: 15,
                    client_id: userId,
                    score: starNum,
                    description: remarkText,
                    pic_list: theIds,
                    userInfo:
                    {
                      img_url: avatarUrl,
                      client_name: name
                    }
                  },
                  success: function (res) {                          
                    _this.setData({
                      remarkOk: true
                    })                  
                    //获取用户自己的评价
                    console.log(userId)
                    wx.request({
                      url: `${api.EvaluateMe}${userId}`,
                      success: function (res) {                                  
                        res.data.data.forEach(function (item) {
                          item.pic_list.forEach(function (t) {
                            t.img_url = `${api.baseUrl}${t.img_url}`
                          })
                        })
                        res.data.data.forEach(function(item){
                          var score = item.score
                          var remark_stars = []
                          for (var i = 0; i < score; i++) {
                            remark_stars.push('1')
                          }
                          item.score = remark_stars
                        })
                        _this.setData({
                          remarksData: res.data.data
                        })                                          
                      }
                    })
                    wx.hideLoading()                                                
                  }
                })

              }
            }
          })
        }
        }else{
          console.log('没有图片')
          //没有图片时发表评论
          wx.request({
            url: api.Evaluate,
            method: "POST",
            header: {
              'Accept': 'application/json',
              'Token': token
            },     
            data: {        
              merchant_id: 15,
              client_id: userId,
              score: starNum,
              description: remarkText,
              userInfo:
              {
                img_url: avatarUrl,
                client_name: name
              }
            },
            success: function (res) {
              console.log(res.data)
              _this.setData({
                remarkOk: true
              })
              //获取用户自己的评价
              console.log(userId)
              wx.request({
                url: `${api.EvaluateMe}${userId}`,
                success: function (res) {
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
              wx.hideLoading()
            }
          })

        }
            
      }
    })}else{
       wx.showToast({
         title: '评论不能少于30个字',
         icon: 'none',
         duration: 2000
       })

    } }else{
     wx.showToast({
       title: '评论信息不完整',
       icon: 'none',
       duration: 2000
     })
    }
    }else{
      wx.showToast({
        title: '未支付不能评论',
        icon: 'none',
        duration: 2000
      })
    }
   
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

    if (app.globalData.userInfo) {
      console.log('dfdf')
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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