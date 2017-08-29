// pages/me/functions/service.js
var photo;
var phone;
var name;
var content
var messageList;
var app= getApp()

Page({
  data: {
    //用户信息，用于头像显示
    userInfo: [],
    //返回数据
    feedback: [],
    //分钟间隔
    minutes: '',
    //清除input框的值
    addinput: []
  },

  onLoad:function(options){
    phone = options.phone
    photo = options.photo
    name = options.name
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
    //将全局的方法赋值
    var that = this;
    messageList = app.cache.messageList||[]
  },



  /**
   * 获取输入内容
   */
  bindInput: function (e) {
      content = e.detail.value
  },

  /**
   * 发送关键字
   */
  sendKeyWord: function () {
    var that = this
    var userInfo = app.cache.userInfo
    var myDate = new Date();
    var hours = myDate.getHours();       //获取当前小时数(0-23)
    var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
    //如果两次时间
    if (minutes == this.data.minutes) {
      var mydata = ''
    } else {
      var mydata = hours + ':' + minutes
    }
    var newfeedback = this.data.feedback;
    var time = {
      content: content,
      myDate: mydata,
      role: true,
      img: userInfo.photo
    };
    newfeedback.push(time);
    this.setData({
      addinput: [],
      minutes: minutes,
      feedback: newfeedback
    })

    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "message_record",
        typeName: "insert",
        field: {
          user: userInfo.phone,
          friend:phone,
          sender:userInfo.phone,
          receiver:phone,
          content: content
        },
        factor: {},
        limit: "1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '发送成功',
          icon: "success",
          duration: 500
        })
        var info = {phone:phone,photo:photo,name:name}
        messageList.push(info)
        console.log(messageList)
        app.saveCache('messageList', messageList)
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          image: '../../img/icon/warn.png'
        })
      }
    });



  }
})