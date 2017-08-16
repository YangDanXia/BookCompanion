// pages/me/account/enroll.js
var app = getApp();
var that = this;
var userPhone;
var passwd;
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
    toSend:true,
    second:60
  },

  /**
   * 获取用户名的输入
   */
  userPhoneInput: function (e) {
      userPhone = e.detail.value
  },

  /**
   * 获取密码的输入
   */
  passwdInput: function (e) {
    passwd = e.detail.value
  },

  /**
   * 发送验证码
   */
  sendCode:function(){
    if(!userPhone){
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
      data:{
        phone:userPhone,
        template: "SMS_84345006",
        param:{number:codeNumber}
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success:function(res){
        console.log(res.data);
        if(res.data !== "OK"){
          wx.showToast({
            title: res.data,
            img: "../../../img/icon/warn.png"
          })
        }
      }
    })
  },


  /**
   * 获取验证码的输入
   */
  codeInput: function (e) {
      code=e.detail.value
  },

  /**
   * 点击注册
   */
  enroll: function () {
    var information = new Array(userPhone,passwd,code);
    // for (var x = 0; x < 3; x++) {
    //   if (!information[x]) {
    //     wx.showToast({
    //       title: "请填写完整信息",
    //       img: '../../../img/icon/warn.png'
    //     })
    //     return false;
    //   }
    // }
    // if(code != codeNumber){
    //   wx.showToast({
    //     title: "验证码错误！",
    //     img: '../../../img/icon/warn.png'
    //   })
    //   return false;
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
      // data:{
      //   request:"newID",
      //   UserId:userPhone,
      //   UserPassword:passwd
      // },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        if (res.data == "error") {
          wx.showToast({
            title: "手机号已存在",
            img: "../../../img/icon/warn.png"
          })
        } else{
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