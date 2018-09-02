const util = require('../../utils/util.js');
const api = require('../../config/api.js');

var theCase = {
  caseUrl:"../../images/banner.jpg",
  caseTitle:"印象公馆林先生简美风格",
  caseAdd:"印象公馆",
  caseSize:140,
  caseStyle:"美式",
  caseProducts:"木门 鞋柜",
  caseDescription:[
    {
      area:"客厅",
      img_url:"",
      description:"客厅是主人..."
    },
    {
      area: "厨房",
      img_url: "",
      description: "厨房..."
    }
  ]
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

    console.log(options.id)

    var _this = this;
    var caseDetailUrl = `${api.caseDetail}${options.id}`
    var caseDetailArea = `${api.caseDetailArea}${options.id}`
    console.log(caseDetailUrl)


    //请求案例详情
    wx.request({
      url: caseDetailUrl,
      success: function (res) {
        console.log(res.data.data)

        res.data.data.forEach(function (item) {
          item.img_url = `${api.baseUrl}${item.img_url}`
        })

        _this.setData({
          theCase: res.data.data[0]
        })
      }
    })   


    //请求案例详情区域图文
    wx.request({
      url: caseDetailArea,
      success: function (res) {
       

        res.data.data.forEach(function (item) {
          item.pic_list.forEach(function(pic){
            pic.img_url = `${api.baseUrl}${pic.img_url}`
          })
        })

        console.log(res.data.data)

        _this.setData({
          areas: res.data.data
        })
      }
    })     

    // util.request(caseDetailUrl).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data[0])
    //     _this.setData({
    //       theCase: res.data[0]
    //     })
    //   }
    // });
   

   

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
    console.log("开始尝试");
    const that = this;
    var myrich = '<div style="color:red">后台富文本自定义编辑详情</div>'; 
    that.setData({ myrich: myrich });
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