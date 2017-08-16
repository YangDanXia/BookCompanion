// pages/me/account/login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    userid: '',
    passwd: '',
    //是否隐藏错误提示
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.getUserInfo()
  },


  /**
   * 确认登录
   */
  doLogin: function () {
    var that = this;
    if (!this.data.userid || !this.data.passwd) {//当账号或密码为空时提示
      wx.showToast({
        title: '手机号或密码不能为空',
        img: "../../../img/icon/warn.png"
      })
      return false;
    }
    wx.request({
      url: 'http://localhost:8080/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "user_info",
        typeName: "inquire",
        field: {info_password: "13420116914"},
        factor: {uk_phone: "13420116914"}
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        if (res.data) {//验证成功，则返回的数据为TRUE,失败则返回false
          //保存登录态，只要用户不删除缓存记录和自动退出，以后都不需要再登录
          app.saveCache('loginFlag',true)
          //返回上一层
          wx.navigateBack({
            delta: 1
          })
        } else {
          //显示密码或账号错误的提示
          that.setData({
            hidden: false
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
   * 获取用户名输入
   */
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
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