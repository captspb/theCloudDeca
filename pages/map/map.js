// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // latitude: 39.915000,
    // longitude: 116.404000,
    // markers: [{
    //   id: 1,
    //   latitude: 39.915000,
    //   longitude: 116.404000,
    //   name: 'T.I.T 创意园'
    // }]
    // covers: [{
    //   latitude: 39.915000,
    //   longitude: 116.404000,
    //   iconPath: '/images/location.png'
    // }, {
    //   latitude: 39.915000,
    //   longitude: 116.404000,
    //   iconPath: '/images/location.png'
    // }]
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var lat = options.lat
    var lng = options.lng
    this.setData({
      latitude:lat,
      longitude:lng,
      markers:[{
        id:1,
        latitude: lat,
        longitude: lng
      }]
    
    })
    console.log(this.data.latitude)
    this.mapCtx = wx.createMapContext('myMap')
  },

  apen_add:function(){
    var latitude = Number(this.data.latitude)
    var longitude = Number(this.data.longitude)

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
                      
                        scale: 28
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
           
            scale: 28
          })
        }
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