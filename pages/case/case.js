const util = require('../../utils/util.js');
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

    wx.setNavigationBarTitle({
      title: '全部案例'
    })
   
    var _this = this
    //请求案例
    wx.request({
      url: api.caseList, 
      success: function (res) {
       console.log(res.data.data)
       
      res.data.data.forEach(function(item){
        item.img_url = `${api.baseUrl}${item.img_url}`
      })

       _this.setData({
         allCase:res.data.data
       })
      }
    })    

   
  },

  toCaseDetail:function(e){
    var id = e.currentTarget.dataset.id;
      console.log(id)
      wx.navigateTo({
        url: `../caseDetail/caseDetail?id=${id}`
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

    // for(var i=1; i<5;i++){
    //   var length = this.data.allCase.length-1;
    //   var length = length + 1;
    //   var moreCase = {
    //     caseUrl: "../../images/banner.jpg",
    //     caseTile: "印象公关简约风格",
    //     caseId: `case_${length}`
    //   }              
    //   this.data.allCase.push(moreCase);    
    // }
    // console.log(this.data.allCase);
    // wx.showLoading({
    //   title: '加载中',
    // })
    // this.setData({
    //   allCase: this.data.allCase
    // })
    // wx.hideLoading()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})