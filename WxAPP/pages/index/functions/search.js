// pages/index/functions/search.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //历史记录
    historicalRecord: app.cache.historicalSearch || [],
    //搜索内容
    searchContent: ''
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      historicalRecord: app.cache.historicalSearch || [] //历史记录
    })
  },


  /**
   * 输入框失焦时触发,获取输入框内容
   */
  bindChange: function (e) {
    this.setData({
      searchContent: e.detail.value //搜索内容
    })
  },


  /**
   * 点击搜索按钮触发，提交搜索内容并进行本地保存
   */
  formSubmit: function () {
    var input = this.data.searchContent;
    // 添加搜索内容到历史记录的数组中
    this.data.historicalRecord.push(input);
    //输入内容不能为空
    if (input == '') {
      wx.showModal({
        title: '提示',
        content: '请输入关键字',
        showCancel: false
      })
      return false;
    }
    // 本地缓存搜索记录
    app.saveCache("historicalSearch", this.data.historicalRecord);
    // 显示搜索结果
    wx.navigateTo({
      url: '../../bookDetails/relatedBooks?tag=' + input
    })
  },


  /**
   *  清除历史记录
   */
  remove: function () {
    if (!app.removeCache("historicalSearch")) {
      wx.showToast({
        title: '清除成功',
        duration: 1800
      })
      //清空搜索记录
      this.setData({
        historicalRecord: []
      })
    }
  }

})