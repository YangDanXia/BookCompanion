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
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
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
      passwd: e.detail.value
    });
  },



  /**
   * 确认登录
   */
  doLogin: function () {
    var that = this;
    if (!this.data.userPhone || !this.data.passwd) {//当账号或密码为空时提示
      wx.showToast({
        title: '手机号或密码不能为空',
        img: "../../../img/icon/warn.png"
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
        field: { info_password: that.data.passwd},
        factor: { uk_phone: that.data.userPhone}
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log("登录："+res.data)
        console.log(res.data.result)
        var result=res.data.result[0].info_password;
        if (result == that.data.passwd) {//验证成功，则返回的数据为TRUE,失败则返回false
          //保存登录态，只要用户不删除缓存记录和自动退出，以后都不需要再登录
          app.saveCache('loginFlag',true)
          app.saveCache('userInfo', { phone: that.data.userPhone,password: that.data.passwd,photo:that.data.userInfo.avatarUrl,name:that.data.userInfo.nickName})
          //返回上一层
          wx.navigateBack({
            delta: 1
          })
        } else {
          //显示密码或账号错误的提示
          wx.showToast({
            title: '手机号或密码错误！',
            image: "../../../img/icon/warn.png"
          })
        }
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