const api = require('../../config/api.js');
var cateId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBars:[],
    tabHigh:0,
    theProducts:[],
    typeName:"",
    type:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
   //请求产品类目
    wx.request({
      url: api.CatalogList,
      success: function (res) {
        console.log(res.data.data)
        var category_id = res.data.data[0].id
        _this.setData({
          tabBars:res.data.data,
          typeName: res.data.data[0].category_name
        })

        //请求产品
        var proUrl = `${api.proList}&category_id=${category_id}`
        console.log(proUrl)      
        wx.request({
          url: proUrl,
          success: function (res) {
                   
            res.data.data.forEach(function (item) {
              item.img_url = `${api.baseUrl}${item.img_url}`
              console.log(item.tag)
              item.tag = item.tag.split(',')
            })
            console.log(res.data.data)          

            function Product(id, product_name){
                this.id = id,
                this.product_name = product_name
            }
            let map = {        
            }
            res.data.data.forEach((item, index) => {          
              const key = item.category_id
              
              if (!map[key]) {
                map[key] = {
                  title: key,
                  products: []
                }
              }
              map[key].products.push(new Product(item.id,item.product_name ))
            })    
            let ret = []         
            for (let key in map) {
              let val = map[key]            
                ret.push(val)         
            }
            console.log(ret)          
            _this.setData({
              theProducts: res.data.data
            })
          }
        })      
      }
    })  

   



  },
  changeTab:function(e){
    var tabID = e.currentTarget.dataset.tab;
    var tabTitle = e.currentTarget.dataset.title;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    var _this = this;
    wx.request({
      url: `${api.proList}&category_id=${id}`,
      success: function (res) {
        console.log(res.data.data)
        res.data.data.forEach(function (item) {
          item.img_url = `${api.baseUrl}${item.img_url}`
        })
        _this.setData({
          theProducts: res.data.data,
          typeName:tabTitle
        })
      }
    })    

    // var obj = allProducts.find(function (x) {
    //   return x.tabTitle === tabTitle
    // })

    if (tabID != this.data.tabHigh) {
      this.setData({
        tabHigh: tabID
      })
    }
  },
  toProductDetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${id}`
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