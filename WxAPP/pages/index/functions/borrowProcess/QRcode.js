// pages/index/functions/borrowProcess/QRcode.js
// const声明的变量不能被改变
const date = new Date()
var codeContent;
var countdown = 60;
var count =180;
var app =getApp()

var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      toSend: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      toSend: false,
      second: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }
    , 1000)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否隐藏网络异常界面
    errHidden: true,
    //判断管理员是否同意
    flag: false,
    //图片地址
    path:'',
    toSend: true,
    second: 60,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var str = options.content;
     //替换所有，为；
     var replace = str.replace(/\,/g, ';')
     codeContent = replace+";"
     console.log("替换后二维码内容："+codeContent)
     var that = this
  //生成二维码
     wx.request({
       url: 'https://www.hqinfo.xyz/Server_Java/EnQRcode',
       data:{
         code: codeContent
       },
      header: {
       'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success:function(res){
         that.setData({
           path: "https://www.hqinfo.xyz/Server_Java/EnQRcode?code=" + codeContent
         })
      }
    })
    this.waitResult(that)
  },

  
  refresh:function(){
    var that = this
    //生成二维码
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/EnQRcode',
      data: {
        code: codeContent
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          path: "https://www.hqinfo.xyz/Server_Java/EnQRcode?code=" + codeContent
        })
      }
    })
    settime(that)
    this.waitResult(that)
  },


  // 倒计时
  waitResult: function (that) {
    if (count == 0) {
      that.setData({
        path: ''
      })
      count = 180;
      return;
    } else {
      // 选择的类型
      var tab = app.globalData.currentTab
      // 选择的图书位置
      var codeValue = app.globalData.codeValue
      // 选择的数量
      var len = codeValue.length
    if(tab == 0){ // 借书
      wx.request({
        url: 'https://www.hqinfo.xyz/ServerForCommunicate/Get?request=getBorrowState',
        //请求头
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          console.log("状态"+res.data)
          if (res.data == 1) {
            wx.showToast({
              title: '操作成功',
              icon: " success"
            })
          // 添加图书到待还栏
          // 删除待借栏的图书
         var time = that.getTime()
         var choose = app.cache.chooseToBorrow
         var returnBook ;
         for(var i = 0 ;i<choose.length;i++){
            choose[i].book_borrowTime = time
         }
         app.saveCache("waitToReturn",choose)
      // 获取选择的下标，如果第一位比第二位小则删除第一位之后 第二位下标减一，如果第一位比第二位大，则不改变
         var waitToBorrow = app.cache.waitToBorrow
         if(len == 1){
            waitToBorrow.splice(codeValue[0], 1);
         }else if(len == 2){
            if(codeValue[0]<codeValue[1]){
              waitToBorrow.splice(codeValue[0], 1);
              waitToBorrow.splice(codeValue[1]-1, 1);
            }else{
              waitToBorrow.splice(codeValue[0], 1);
              waitToBorrow.splice(codeValue[1], 1);
            }    
          }
          app.removeCache("chooseToBorrow")
          app.saveCache("waitToBorrow",waitToBorrow)
          // wx.navigateTo({
          //     url: '../bookOrder',
          //   })
            wx.navigateBack({
              delta:1
            })
            clearTimeout(t)
          }
        }, 
        fail: function () {
          wx.showToast({
            title: '网络异常',
            image: '../../../../img/icon/warn.png'
          })
        }
      })
  }else if(tab == 1){
      wx.request({
        url: 'https://www.hqinfo.xyz/ServerForCommunicate/Get?request=getReturnState',
        //请求头
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          console.log("状态" + res.data)
          if (res.data == 1) {
            wx.showToast({
              title: '操作成功',
              icon: " success"
            })
            // 删除待借栏的图书
            var waitToReturn = app.cache.waitToReturn
            if (len == 1) {
              waitToReturn.splice(codeValue[0], 1);
            } else if (len == 2) {
              if (codeValue[0] < codeValue[1]) {
                waitToReturn.splice(codeValue[0], 1);
                waitToReturn.splice(codeValue[1] - 1, 1);
              } else {
                waitToReturn.splice(codeValue[0], 1);
                waitToReturn.splice(codeValue[1], 1);
              }
            }
            app.saveCache("waitToReturn", waitToReturn)
            console.log("退出")
            wx.navigateBack({
              delta: 1
            })
            clearTimeout(t)
          }
        }
        , fail: function () {
          wx.showToast({
            title: '网络异常',
            image: '../../../../img/icon/warn.png'
          })
        }
      })

  }
      count--;
    }
    var t = setTimeout(function () {
      that.waitResult(that)
    }
      , 1000)
  },

    /**
   * 获取时间
   */
  getTime:function(){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year+'-'+month+'-'+day;
}

})