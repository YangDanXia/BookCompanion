// pages/me/account/changePhone.js
var app = getApp();
var that = this;
var oldPhone;
var newPhone;
var codeNumber;
var code;
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      toSend: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      toSend: false,
      second: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }
    , 1000)
}
Page({

  data: {
    toSend: true,
    second: 60,
    phone: app.cache.userInfo.phone
  },

  /**
   * 获取原手机号输入
   */
  oldPhone: function (e) {
    oldPhone = e.detail.value
  },

  /**
   * 获取新手机号输入
   */
  newPhone: function (e) {
    newPhone = e.detail.value
  },

  /**
   * 发送验证码
   */
  sendCode: function () {
    if (!oldPhone) {
      wx.showToast({
        title: "请输入手机号",
        img: '../../../img/icon/warn.png'
      })
      return false;
    }
    codeNumber = app.getRandom(100000);

    var that = this;
    settime(that);
    wx.request({
      url: 'http://localhost:8080/Server_Java/SendMessage',
      data: {
        phone: oldPhone,
        template: "SMS_84345006",
        param: { number: codeNumber }
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        if (res.data !== "OK") {
          wx.showToast({
            title: res.data,
            image: "../../../img/icon/warn.png"
          })
        }
      }
    })
  },


  /**
   * 获取验证码的输入
   */
  codeInput: function (e) {
    code = e.detail.value
  },

  /**
   * 修改手机号
   */
  changePhone: function () {
    var information = new Array(oldPhone, newPhone, code);
    for (var x = 0; x < 3; x++) {
      if (!information[x]) {
        wx.showToast({
          title: "请填写完整信息",
          image: '../../../img/icon/warn.png'
        })
        return false;
      }
    }
   
   if(oldPhone!=this.data.phone){
     wx.showToast({
       title: "原号码错误！",
       image: '../../../img/icon/warn.png'
     })
     return false;
   }

    if (code != codeNumber) {
      wx.showToast({
        title: "验证码错误！",
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
        dbName: "WxApp",
        table: "user_info",
        typeName: "update",
        field: { uk_phone: newPhone},
        factor: { uk_phone: oldPhone}
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
            title: '修改成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateTo({
                url: '../acount/login',
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