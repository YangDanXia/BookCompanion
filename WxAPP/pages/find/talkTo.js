// pages/me/functions/service.js
// 对方头像
const date = new Date()
var photo;
// 对方ID
var phone;
// 对方昵称
var name;
// 发送的内容
var content;
// 聊天记录表
var messageList;
// 显示的内容形式
var way;
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
    way = options.way
    if(way =="read"){
      this.readMsg()
    }
    // info:{对方手机号，对方头像，对方昵称，对方来信未读数}
    messageList = app.cache.messageList || []
    console.log(messageList)
    var info = { phone: phone, photo: photo, name: name }
    for (var i = 0; i < messageList.length; i++) {
      if (messageList[i].phone == phone) {
        return false;
      }
    }
    messageList.push(info)
    app.saveCache('messageList', messageList)
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
      img: userInfo.avatarUrl
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
          user: userInfo.userPhone,
          friend:phone,
          sender:userInfo.userPhone,
          receiver:phone,
          content: content,
          send_time:that.getTime()
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
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          image: '../../img/icon/warn.png'
        })
        return false;
      }
    });
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "message_record",
        typeName: "insert",
        field: {
          user: phone,
          friend: userInfo.userPhone,
          sender: userInfo.userPhone,
          receiver: phone,
          content: content,
          send_time: that.getTime()
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
  },

  /**
   * 读取留言记录
   */
  readMsg:function(){
    // 用户自身的信息
    var that = this
    var userInfo = app.cache.userInfo
    var minutes = date.getMinutes();     //获取当前分钟数(0-59)
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "message_record",
        typeName: "inquire",
        field: {user:'',sender: '', receiver: '', content: '',send_time:'' },
        factor: { user: userInfo.userPhone,friend:phone},
        limit: "100"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var newfeedback = that.data.feedback;
        var obj = res.data.result
        var time ={}
        for(var i=0;i<obj.length;i++){
          // 如果我是发送者，则显示我的消息,role为true；如果我是接收者，则显示对方的消息,role为false
          if(obj[i].user == obj[i].sender){
            time = {
              content: obj[i].content,
              myDate: obj[i].send_time,
              role: true,
              img: userInfo.avatarUrl
            };
          }else{
            time = {
              content: obj[i].content,
              myDate: obj[i].send_time,
              role:false,
              img: photo
            };
          }
          newfeedback.push(time);
        }
        that.setData({
          addinput: [],
          minutes: minutes,
          feedback: newfeedback
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          image: '../../../img/icon/warn.png'
        })
      }
    })
  },

 /**
  * 获取时间
  */
  getTime: function () {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hours = date.getHours();       //获取当前小时数(0-23)
    var minutes = date.getMinutes();     //获取当前分钟数(0-59)
    return year + '-' + month + '-' + day + '-'+hours+':'+minutes;
    
  }



})