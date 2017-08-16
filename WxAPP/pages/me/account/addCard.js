// pages/me/account/addCard.js
 
var app = getApp()
Page({

  data: {
    array: ['广东海洋大学图书馆', '中国', '巴西', '日本'],
    index: 0,
    phone:app.cache.userInfo.phone
  },


  /**
   * 获取借书证的输入
   */
  cardNumInput: function (e) {
    this.setData({
      cardNum: e.detail.value
    });
  },

  /**
   * 获取图书馆的输入
   */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 点击添加
   */
 addCard:function(){
   var that = this;
   wx.request({
     url: 'http://localhost:8080/Server_Java/DbOperations',
     data:
     {
       table: "bookcard_record",
       typeName: "insert",
       field: {idx_phone: that.data.phone,uk_bookCardId: that.data.cardNum, library: that.data.array[this.data.index]},
       factor: {}
     },
     //请求头
     header: {
       'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
     },
     method: 'GET',
     success: function (res) {
       if(res.data){
         wx.showToast({
           title: '添加成功',
           icon:'success'
         })
         wx.navigateBack({
           delta:1
         })
       }
     }
   })
 }

})