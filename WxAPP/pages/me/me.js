// pages/me/me.js
const date = new Date()
var app = getApp()
// 书卷数量
var num = app.cache.bookTicket || 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.cache.userInfo,
    //登录状态
    loginFlag: app.cache.loginFlag || false,
    // 打卡天数
    days:app.cache.checkIn.days

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loginFlag: app.cache.loginFlag || false
    })
  },

  /**
   * 进入登录界面
   */
  login: function () {
    wx.navigateTo({
      url: 'account/login'
    })
  },


  /**
   * 查看借书证
   */
  bookCard: function () {
    if (!this.data.loginFlag) {
      this.login()
    } else {
      wx.navigateTo({
        url: 'account/bookCard'
      })
    }
  },

 /**
  * 发布的历史消息
  */
  historyMess: function () {
    if (!this.data.loginFlag) {
      this.login()
    } else {
      wx.navigateTo({
        url: 'myPublished'
      })
    }
  },

  /**
   * 打卡
   */
  checkIn:function(){
    var content = app.cache.checkIn || [];
    var data = this.getTime()
    var days = content.days || 0;
    var arr;
    if(content.data!= data){
      days++ ;
      num++;
      arr = { data: data, days:days }
      this.setData({
        days:days
      })
      wx.showToast({
        title: "书卷+1",
        icon:"success",
        duration:1000
      })
      app.saveCache('checkIn',arr)
      app.saveCache('bookTicket',num)
    }else{
      wx.showToast({
        title: "今天已完成打卡了哦~",
        image: "../../img/icon/warn.png"
      })
      return;
    }
  },



  /**
   * 退出登录
   */
  logOut: function () {
    app.removeCache('userInfo')
    app.saveCache('loginFlag', false)
    wx.showToast({
      title: '注销成功',
      icon: 'success',
      duration: 1000
    })
    this.onShow();
  },


  /**
   * 获取时间
   */
  getTime: function () {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + '-' + month + '-' + day;
  },


})
