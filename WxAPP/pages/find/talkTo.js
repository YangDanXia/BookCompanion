// pages/me/functions/service.js
Page({
  data: {
    //用户信息，用于头像显示
    userInfo: [],
    //返回数据
    feedback: [{
      content: '欢迎您的到来！输入以下关键词即可获取相应的资讯噢~\n【推荐书籍】\n【预约书籍】\n【借阅书籍】\n【还书提醒】\n【图书荐购】\n【关于我们】',
      content_type: 0,
      contract_info: '',
      myDate: '',
      role: false,
      img: "../../../img/icon/ask.png"
    }],
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
      case '推荐书籍': newfeedback.push(time, {
        content: '【推荐书籍】我们将根据您的长期阅读及一段时间的多次搜索习惯向您定期推荐相关书籍。您可以自己设置推荐频率：打开APP，点击“我”—“设置”—“允许推荐书籍”，我们默认为每日推荐。您可以手动关闭，再开启时将会自动弹出推荐频率的显示框，点击之后将完成您的选择。',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: false,
        img: "../../../img/icon/ask.png"
      });
        break;

      case '预约书籍': newfeedback.push(time, {
        content: '【预约书籍】您可以在线预订书籍，点击APP中“发现”—“预约栏”，然后指定具体时间去图书馆取书。如果不巧暂时没有藏书，当有用户归还书籍后系统将自动给您推送信息提醒。若想关闭，则点击APP中的“设置”—“藏书到馆提醒”，点击一下之后则为手动关闭。',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: false,
        img: "../../../img/icon/ask.png"
      });
        break;

      case '借阅书籍': newfeedback.push(time, {
        content: '【借阅书籍】您在图书馆可以使用APP借阅书籍，一次可借2本书。图书上贴有二维码，点击APP中的“发现”，应用左上角的扫码功能，扫描图书二维码，将书放入借书栏，在出图书馆之前出示自己的借书二维码给图书管理员。管理员会扫描您出示的二维码来调出您的借书单，并与事物进行比较。之后您通过微信支付手段的方式提交押金。',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: false,
        img: "../../../img/icon/ask.png"
      });
        break;
      case '还书提醒': newfeedback.push(time, {
        content: '【还书提醒】为了方便您的使用，我们推出贴心的“藏书到馆提醒”功能。从离还书日期倒计时一周开始我们会提醒您去图书馆还书。如果不想收到该提醒，则在APP中点击“我”—“设置”—“藏书到馆提醒”手动关闭。',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: false,
        img: "../../../img/icon/ask.png"
      });
        break;

      case '图书荐购': newfeedback.push(time, {
        content: '【图书荐购】我们诚挚的邀请您来为我们推荐您阅读过而我们APP中没有的精彩书籍。打开APP点击“我”—“图书荐购”，按照提示输入完整的书籍相关信息，最后点击添加我们就会收到您推荐的精彩书籍。希望您能够热心推荐，在此我们不胜感激。',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: false,
        img: "../../../img/icon/ask.png"
      });
        break;

      case '关于我们': newfeedback.push(time, {
        content: '【关于我们】Hello亲爱的书友，很高兴在这里遇见你。我们是海洋技术团队，一群热爱生活的年轻人因爱好软件开发而聚集在一起。在这您能够更好地了解我们APP主要功能的使用，包括在线预订，借书等，还可设置贴心的“还书提醒”喔！如果有什么好的建议或想法可以在APP中“我”—“意见反馈”留下您宝贵的笔迹。我们一定会认真对待，努力将我们的产品完善的更好。',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: false,
        img: "../../../img/icon/ask.png"
      });
        break;
      case '': return false; break;
      default: newfeedback.push(time, {
        content: '请输入正确的关键词',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: false,
        img: "../../../img/icon/ask.png"
      });

    }
    this.setData({
      addinput: [],
      minutes: minutes,
      feedback: newfeedback
    })
  }
})