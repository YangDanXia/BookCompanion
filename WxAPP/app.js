//app.js
App({

  onLaunch: function () {
    var that = this
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
 
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.width = res.windowWidth
        that.globalData.winHeight = res.windowHeight
        that.globalData.scrHeight = res.screenHeight
      }
    });

    /**
     * 自动建立第一本书单
     */
    wx.getStorage({
      key: 'bookShelf',
      success: function (res) { return; },
      fail: function () {
        var newBookShelf = [{
          "shelf_photo": "../../img/show/book.png",
          "shelf_name": "我喜欢的图书",
          "shelf_intro": "",
          "shelf_bookList": [],
          "shelf_tag":[],
          "bookNum":0
        }]
        that.saveCache('bookShelf', newBookShelf)
      }
    })



     /**
      * 建立用户信息
      */
    wx.getStorage({
      key: 'userInfo',
      success: function (res) { return; },
      fail: function () {
        var newInfo = {
          userPhone:'',
          userPassword:'',
          avatarUrl:'img/icon/user.png',
          nickName:'匿名',
          bookTicket:0
        }
        that.saveCache('userInfo', newInfo)
      }
    })

    
    /**
     * 读取缓存
    */
    try {
      var data = wx.getStorageInfoSync();
      if (data && data.keys.length) {
        data.keys.forEach(function (key) {
          var value = wx.getStorageSync(key);
          if (value) {
            that.cache[key] = value;
          }
        });
      }
    } catch (e) { 
      console.warn('获取缓存失败'); 
    }
  },


  /**
  * 保存缓存
  */
  saveCache: function (key, value) {
    if (!key) { 
      return false;
    }
    this.cache[key] = value;
    wx.setStorage({
      key: key,
      data: value,
    })
    return true;
  },



  /**
   * 清理缓存
   */
  removeCache: function (key) {
    if (!key) { return false; }
    this.cache[key] = '';
    wx.removeStorage({
      key: key
    });
  },


  /**
   * 获取随机数
   */
  getRandom: function (length) {
    var num = Math.random() * length;
    var res = Math.floor(num);
    return res;
  },


  /**
   * 获取用户信息
   */
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        },
        fail: function () {
          
        }
      })
    }
  },


  //缓存内容
  cache: {},

  //全局常量
  globalData: {
    userInfo: null,
    //屏幕高度
    scrHeight: '',
    //可使用窗口高度
    winHeight: '',
    //宽度
    width: '' ,
    //图书馆
    G_Libraries: '',
    //选择的图书馆
    G_selectLibrary:'',
    // 地理位置
    latitude:'',
    longitude:'',
    // 图书选择的下标
    codeValue:[],
    // 类型的选择
    currentTab:0,
    // // 未读信息数量
    // unreadNum:0,
    // // 未读信息列表
    // unreadList:[]
  }
})