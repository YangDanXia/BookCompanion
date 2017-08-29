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
    // 屏幕高度
    winHeight: app.globalData.winHeight
  },

  onLoad: function () {

  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var list = app.cache.messageList||''
    if(list ==''){
      this.setData({
        msgHidden:false
      })
    }else{
      this.setData({
        msgList:list
      })
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 进入聊天界面
   */
  message:function(e){
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
  }

})