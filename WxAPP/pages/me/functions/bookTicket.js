// pages/me/functions/bookTicket.js
var app =getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: app.globalData.width,
    // 书卷的获得
    array:["每日打卡","借阅图书","按时还书","购买电子书","发布","意见反馈"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var obj = app.cache.userInfo || []
    this.setData({
     num: obj.bookTicket || 0
   })
  },

  /**
   * 提示
   */
  tellIntro:function(e){
    var index = e.currentTarget.dataset.index
    var intro;
    switch(index){
      case 0: 
       intro = "每日打卡即可获得一张书卷"
      break;
      case 1 :
       intro = "成功在图书馆借阅一本图书即可获得一张书卷"
      break;
      case 2: 
       intro = "在规定的时间内归还图书即可获得一张书卷；若逾期未归还图书，则在三天后起，每日扣除一张书卷"
      break;
      case 3: 
       intro = "参与凑单活动并购买电子书即可获得一张书卷"
      break;
      case 4:
       intro = "发布二手图书买卖消息，每条需扣除一张书卷"
       break;
      case 5: 
       intro = "向我们反馈小程序内需改进的内容，若意见被采纳可获得两张书卷"      
      break;
    }

    wx.showModal({
      title: '提示说明',
      content: intro,
      showCancel:false,
      success: function (res) {
      }
    })
  }



 
})