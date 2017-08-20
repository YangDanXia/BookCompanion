// pages/me/account/addCard.js
 
var app = getApp();
Page({

  data: {
    array: ['广东海洋大学图书馆', '湛江市图书馆'],
    index: 0,
    phone: app.cache.userInfo.phone || ''
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
     url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
     data:
     {
       dbName: "WxApp",
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
         var obj = app.cache.bookCard;
         var newCard = { history_borrow: "0", library: that.data.array[that.data.index], uk_bookCardId: that.data.cardNum, current_borrow:"0"};
         obj.push(newCard);
         app.saveCache('bookCard', obj);
         wx.showToast({
           title: '添加成功',
           icon:'success'
         })
         wx.navigateBack({
           delta:1
         })
       }
     },fail: function () {
       wx.showToast({
         title: '网络异常',
         image: '../../../img/icon/warn.png'
       })
     }
   })
 }

});