// pages/me/functions/notice.js
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换
    currentTab: 0,
    msgHidden:true,
    informHidden: false,
    replyHidden:true,
    // 屏幕高度
    winHeight: app.globalData.winHeight
  },

  onLoad: function () {
    var list = app.cache.messageList || ''
    this.setData({
      msgList: list
    })
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMsgDetail()
    var list = app.cache.messageList || ''
    this.setData({
      msgList: list
    })
  },
 
  /**
   * 滑动切换Tab
   */
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },


  /**
   * 点击Tab切换
   */
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },


 /**
  * 获取通知信息
  */
  getMsgDetail: function () {
    var that = this
    var userInfo = app.cache.userInfo || ''
    var phone = userInfo.userPhone || ''
    var obj;
    if (!app.cache.loginFlag) {
      return false;
    }
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/MsgBoard',
      data:
      {
        user:phone,
        receiver:phone
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        if(res.data.result.length ==0 ){
          that.setData({
            replyHidden:false
          })
        } else if (res.data.result.length >0){
          that.setData({
            replyList: res.data.result
          })
        }

      },
      fail: function (res) {
        console.log("fail")
        return false;
      }
    })
   

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 进入聊天界面
   */
  message:function(e){
    var index = e.currentTarget.dataset.index
    var types = e.currentTarget.dataset.type
    var that = this
    var userInfo = app.cache.userInfo
    var list;
    if(types == "reply"){
      list = this.data.replyList
    }else if(types == "msg"){
      list = app.cache.messageList
    }
    var phone = list[index].phone
    var photo = list[index].photo
    var name = list[index].name
    // 将阅读状态改为已读
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "message_record",
        typeName: "update",
        field: {status: '1' },
        factor: {sender:phone,receiver:userInfo.phone, status: '0' },
        limit: "100"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        console.log("fail")
      }
    })
    wx.navigateTo({
      url: '../../find/talkTo?phone=' + phone + '&photo=' + photo + '&name=' + name + '&way=read'
    })
  },

  /**
   * 删除对话
   */
  delMsg:function(e){
    var index = e.currentTarget.dataset.index
    var msgList = app.cache.messageList
    msgList.splice(index,1)
    app.saveCache("messageList",msgList)
    this.setData({
      msgList: msgList
    })
  },

  /**
   * 删除留言
   */
  delReply: function (e) {
    var index = e.currentTarget.dataset.index
    var reList = this.data.replyList
    reList.splice(index, 1)
    this.setData({
      replyList: reList
    })
  }

})