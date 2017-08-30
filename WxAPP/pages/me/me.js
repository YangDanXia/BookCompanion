// pages/me/me.js
const date = new Date()
var app = getApp()
// 打卡记录
var checkIn
// 打卡天数
var days


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.cache.userInfo||'',
    //登录状态
    loginFlag: app.cache.loginFlag || false,
    winHeight: app.globalData.winHeight
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    checkIn = app.cache.checkIn || [];
    days = checkIn.days || 0;
    this.getMsgDetail()
    this.setData({
      days:days,
      loginFlag: app.cache.loginFlag || false,
      userInfo: app.cache.userInfo
    })
  },

  /**
   * 获取通知信息
   */
  getMsgDetail: function () {
    var that = this
    var userInfo = app.cache.userInfo || ''
    var phone = userInfo.userPhone || ''
    if (!app.cache.loginFlag) {
      return false;
    }
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "message_record",
        typeName: "inquire",
        field: { sender: '', receiver: '', status: '' },
        factor: {user:phone, receiver: phone, status: '0' },
        limit: "100"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        // 未读数量
        that.setData({
          unreadNum: res.data.result.length
        })
      },
      fail: function (res) {
        console.log("fail")
      }
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
    var data = this.getTime()
    var obj = this.data.userInfo || ''
    // 书卷数量
    var num = obj.bookTicket || 0
    var arr;
    if(checkIn.data!= data){
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
      obj.bookTicket = num
      app.saveCache('checkIn',arr)
      app.saveCache('userInfo',obj)
    }else{
      wx.showToast({
        title: "今天已完成打卡了哦~",
        image: "../../img/icon/warn.png"
      })
      return;
    }
  },

  /**
   * 提示用户
   */
  warnUser:function(){
    if (!this.data.loginFlag) {
      this.login()
    } else {
      wx.navigateTo({
        url: 'functions/notice'
      })
    }

  },


  /**
   * 退出登录
   */
  logOut: function () {
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
  }


})
