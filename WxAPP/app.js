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
          "shelf_photo": "../../../img/show/book.png",
          "shelf_name": "我喜欢的图书",
          "shelf_intro": "",
          "shelf_bookList": []
        }]
        that.saveCache('bookShelf', newBookShelf)
      }
    })
    
    /**
     * 自动建立签到机制
     */
    wx.getStorage({
      key: 'checkIn',
      success: function (res) { return; },
      fail: function () {
        var newCheck = {
         "data":"0",
         "days":"0"
        }
        that.saveCache('checkIn', newCheck)
      }
    })

    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx2b32ac8600d1cef0&secret=e3b94eafd696bc0913cc1dd40f0b7069&js_code=" + res.code + "&grant_type=authorization_code",
            success: function (res) {
              console.log(res.data.openid)
            }
          });
        }
      },
      fail: function () {
        that.showWarnModal('提示', '拒绝授权将导致部分功能无法使用，请重新打开再点击允许授权！')
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
    } catch (e) { console.warn('获取缓存失败'); }

    //  启动连接池
    wx.request({
      url: 'http://localhost:8080/Server_Java/InitSql',
      data:{
        dbName:"WxApp"
      },      
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success:function(res){
        
      }
    })


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
          if (res.code) {
            wx.request({
              url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx2b32ac8600d1cef0&secret=e3b94eafd696bc0913cc1dd40f0b7069&js_code=" + res.code + "&grant_type=authorization_code",
              success: function (res) {
                wx.setStorage({
                  key: 'openId',
                  data: res.data.openid
                });
                console.log(res.data.openid+"last")
              }
            });
          }
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        },
        fail: function () {
          that.showWarnModal('提示', '拒绝授权将导致部分功能无法使用，请重新打开再点击允许授权！')
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
    //选择的图书馆
    G_selectLibrary:''
  }
})