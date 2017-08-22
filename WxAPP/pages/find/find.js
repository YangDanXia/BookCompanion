// pages/find/find.js
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
    console.log("1")
     wx.request({
       url: 'http://139.199.205.225:5000/lang',
       data:{
         dbName: "WxApp",
         table: "user_info",
         typeName: "inquire"
       },
       header: {
         'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
       },
       method: 'POST',
       success:function(res){
         console.log(res)
       },
       fail:function(res){
         console.log(res)
       }
     })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 数据加载完成后 延迟隐藏loading
    setTimeout(function () {
      that.setData({
        loadhidden: true
      })
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },


  /**
   * 发布文章
   */
  publish:function(){
    wx.navigateTo({
      url: 'publish',
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