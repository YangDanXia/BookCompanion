// pages/index/functions/search.js
var app = getApp();
// 搜索的类型
var val_type ='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //历史记录
    historySearch: app.cache.historySearch || [],
    //搜索内容
    searchContent: '',
    array:[
      { name:'title',value:'书名'},
      { name: 'author', value: '作者' },
      { name: 'publisher', value: '出版社' }
      ]

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      historySearch: app.cache.historySearch || [] //历史记录
    })
  },


 /**
 * 类型的输入
 */
  bindPickerChange: function (e) {
    val_type= e.detail.value
    console.log(val_type)
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

    //输入内容不能为空
    if (input == '') {
      wx.showToast({
        title: '请输入关键字',
        image: '../../../img/icon/warn.png'
      })
      return false;
    }else if(val_type == ''){
      wx.showToast({
        title: '请选择搜索类型',
        image: '../../../img/icon/warn.png'
      })
      return false;
    }
    // 添加搜索内容到历史记录的数组中
    var obj = this.data.historySearch;
    var cont = {input:input,val_type:val_type}
    this.data.historySearch.push(cont);
    // 本地缓存搜索记录
    app.saveCache("historySearch",obj);
    // 显示搜索结果
    wx.redirectTo({
      url: '../../bookDetails/relatedBooks?tag=' + input + '&table=' + val_type + '&way=find'
    })
  },


  /**
   *  清除历史记录
   */
  remove: function () {
    if (!app.removeCache("historySearch")) {
      wx.showToast({
        title: '清除成功',
        duration: 1800
      })
      //清空搜索记录
      this.setData({
        historySearch: []
      })
    }
  }

})