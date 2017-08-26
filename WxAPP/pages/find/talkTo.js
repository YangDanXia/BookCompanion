// pages/me/functions/service.js
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


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
    //将全局的方法赋值
    var that = this;
    //调用登录接口
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            })
            typeof cb == "function" && cb(res.userInfo)
          }
        })
      }
    })
  },



  /**
   * 获取输入内容
   */
  bindInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 发送关键字
   */
  sendKeyWord: function () {
    var that = this
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
      content: that.data.content,
      content_type: 0,
      contract_info: this.data.contract_info,
      myDate: mydata,
      role: true,
      img: that.data.userInfo.avatarUrl,
    };
    switch (this.data.content) {
      default: newfeedback.push(time);
    }
    this.setData({
      addinput: [],
      minutes: minutes,
      feedback: newfeedback
    })
  }
})