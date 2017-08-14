// pages/me/account/enroll.js
var app = getApp()
Page({

  data: {
  },

  /**
   * 获取用户名的输入
   */
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    });
  },

  /**
   * 获取密码的输入
   */
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    });
  },


  /**
   * 点击注册
   */
  enroll: function () {
    var information = new Array(this.data.userid, this.data.passwd, this.data.name, this.data.phone, this.data.address);
    for (var x = 0; x < 5; x++) {
      if (!information[x]) {
        wx.showToast({
          title: "请填写完整信息",
          img: '../../../img/icon/warn.png'
        })
        return false;
      }
    }
    wx.request({
      url: 'http://localhost:8080/BookBorrow_WxApp/DBOperations',
      data:
      {
        request: "newID",
        UserId: this.data.userid,
        UserPassword: this.data.passwd,
        UserOpenID: app.cache.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        if (res.data == "1062") {
          app.showWarnModal('提示', '手机号已存在');
        } else if (res.data) {
          wx.setStorageSync('information', information);
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "网络异常",
          img: "../../../img/icon/warn.png"
        })
      }
    })
  },


  /**
   * 取消注册
   */
  reset: function () {
    wx.switchTab({
      url: '../me'
    })
  }


})