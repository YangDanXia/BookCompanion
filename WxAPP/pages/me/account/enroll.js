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
   * 获取验证码的输入
   */
  passwdInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },

  /**
   * 点击注册
   */
  enroll: function () {
    var information = new Array(this.data.userid, this.data.passwd, this.data.code);
    // for (var x = 0; x < 3; x++) {
    //   if (!information[x]) {
    //     wx.showToast({
    //       title: "请填写完整信息",
    //       img: '../../../img/icon/warn.png'
    //     })
    //     return false;
    //   }
    // }
  /**
   * 连接数据库
   * 需要的数据：数据库名，数据表，操作类型，手机号，密码
   */
    wx.request({
      url: 'http://localhost:8080/Server_Java/DbOperations',
      data:
      {
        dbName:"WxApp",
        table:"user_info",
        typeName:"insert",
        field:{uk_phone:"13420116914",info_password:"13420116914"},
        factor:{}
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
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