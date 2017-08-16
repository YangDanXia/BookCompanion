// pages/me/account/changePassword.js
var app = getApp();
var that = this;
var old;
var passwd;
var rePasswd;

Page({

  data: {
    toSend: true,
    second: 60,
    oldPasswd: app.cache.userInfo.password,
    phone: app.cache.userInfo.phone
  },

  /**
   * 获取用户名的输入
   */
  oldPasswd: function (e) {
    old = e.detail.value
  },

  /**
   * 获取密码的输入
   */
  newPasswd: function (e) {
    passwd = e.detail.value
  },

  /**
   * 重复的密码
   */
  renewPasswd:function(e){
    rePasswd=e.detail.value
  },
  

  /**
   * 点击修改
   */
  changePasswd: function () {
    var information = new Array(old, passwd, rePasswd);
    for (var x = 0; x < 3; x++) {
      if (!information[x]) {
        wx.showToast({
          title: "请填写完整信息",
          image: '../../../img/icon/warn.png'
        })
        return false;
      }
    }
    if (old != this.data.oldPasswd) {
      wx.showToast({
        title: "原密码错误！",
        image: '../../../img/icon/warn.png'
      })
      return false;
    } 
    if (passwd != rePasswd) {
      wx.showToast({
        title: "两次密码不一致！",
        image: '../../../img/icon/warn.png'
      })
      return false;
    }
    /**
     * 连接数据库
     * 需要的数据：数据表，操作类型，手机号，密码
     */
    wx.request({
      url: 'http://localhost:8080/Server_Java/DbOperations',
      data:
      {
        table: "user_info",
        typeName: "update",
        field: { info_password: passwd },
        factor: { uk_phone: this.data.phone }
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        if (res.data == "error") {
          wx.showToast({
            title: "系统繁忙",
            image: "../../../img/icon/warn.png"
          })
        } else {
          wx.showToast({
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateTo({
                url:'../account/login'
              })
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "网络异常",
          image: "../../../img/icon/warn.png"
        })
      }
    })
  }


})