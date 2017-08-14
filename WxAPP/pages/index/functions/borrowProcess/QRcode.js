// pages/index/functions/borrowProcess/QRcode.js
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
    path:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var codeContent = options.content;
     //替换所以，为；
     var str = codeContent.replace(/\,/g, ';')
     var that = this
  //生成二维码
     wx.getImageInfo({
       src:"http://localhost:8080/Library_WxApp/EnQRcode?code="+str,
       success:function(res){
         that.setData({
           path:res.path
         })
       }
     })


  // 进入付款页面
     var interval;
     interval = setInterval(function () {
       wx.request({
         url: 'http://119.29.104.141:8088/ServerForCommunicate/Get?request=getMsg',
         success: function (res) {
           if (res.data != "") {//一接收到指定的数据就停止
             clearInterval(interval)
             wx.redirectTo({
               url: 'pay',
             })
           }
         }
       })
     }, 1500)
  }


})