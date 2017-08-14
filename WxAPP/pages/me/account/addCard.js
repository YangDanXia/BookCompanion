// pages/me/account/addCard.js
 
var app = getApp()
Page({

  data: {
    array: ['广东海洋大学图书馆', '中国', '巴西', '日本'],
    index: 0
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
   console.log(this.data.array[this.data.index])
   console.log(this.data.cardNum)
 }

})