// pages/me/account/login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    userPhone: '',
    passwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    var info = app.cache.userInfo || {}
    app.getUserInfo(function (userInfo) {
      info.avatarUrl = userInfo.avatarUrl
      info.nickName = userInfo.nickName
      app.saveCache("userInfo",info)
    })
  },


  /**
   * 获取用户名输入
   */
  userPhoneInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    });
  },


  /**
   * 获取密码输入
   */
  passwdInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    });
  },



  /**
   * 确认登录
   */
  doLogin: function () {
    var that = this;
    if (!this.data.userPhone || !this.data.userPassword) {//当账号或密码为空时提示
      wx.showToast({
        title: '手机号或密码不能为空',
        image: "../../../img/icon/warn.png"
      })
      return false;
    }
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "user_info",
        typeName: "inquire",
        field: { userPassword: that.data.userPassword},
        factor: { userPhone: that.data.userPhone},
        limit:"0,1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        var obj = res.data.result
        if(obj.length == 0){
          wx.showToast({
            title: '账号不存在！',
            image: "../../../img/icon/warn.png"
          })
          return false;
        }
        var result=res.data.result[0].userPassword;
        if (result == that.data.userPassword) {
          var info = app.cache.userInfo || {}
          info.userPhone = that.data.userPhone
          info.userPassword = that.data.userPassword
          app.saveCache("userInfo",info)
          app.saveCache('loginFlag',true)
          //返回上一层
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500);  
        } else {
          //显示密码或账号错误的提示
          wx.showToast({
            title: '手机号或密码错误！',
            image: "../../../img/icon/warn.png"
          })
        }

        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
      }, fail: function () {
        wx.showToast({
          title: '网络异常',
          image: '../../../img/icon/warn.png'
        })
      }
    })
  },



  /**
   * 注册账号
   */
  doEnroll: function () {
    wx.navigateTo({
      url: 'enroll'
    })
  },

  /**
   * 找回密码
   */
  findPasswd:function(){
    wx.navigateTo({
      url: 'findPassword'
    })
  }

});