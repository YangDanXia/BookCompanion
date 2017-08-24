// pages/shelf/functions/addShelf.js
var app =getApp()
var name = '';
var intro;
var tag;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //封面图片
    img: "../../../img/show/book.png",
    //书单内容
    bookShelf:app.cache.bookShelf||[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  
  /**
   * 上传本地照片
   */
  chooseImg: function(){
    var that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: 'compressed', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          img:res.tempFilePaths
        })
      }
    })
   },

   /**
    * 设置名称
    */
    nameInput:function(e){
      name = e.detail.value
    },

    introInput:function(e){
      intro = e.detail.value
    },

    tagInput: function (e) {
      tag = e.detail.value
      tag = tag.split(",")
    },

   /**
    * 保存修改信息
    */
    submit: function (e) {
      var index = e.currentTarget.dataset.index
      if (!this.data.content[index]) {
        wx.showToast({
          title: "请输入信息",
          image: "../../../img/icon/warn.png"
        })
      } else {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })

        this.setData({
          modalHidden: true
        }) 
      }

    },

 

    /**
     * 创建书单
     */
    createShelf:function(){
      if (name == ''){
          wx.showToast({
            title: '请填写完整信息',
            image:'../../../img/icon/warn.png'
          })
          return false;
        }
      var obj = this.data.bookShelf;
      console.log(obj)
      var newShelf = {"shelf_photo": this.data.img, "shelf_name": name, "shelf_intro": intro, "shelf_bookList": [], shelf_tag:tag}
      console.log("添加的书单信息："+newShelf)
      obj.push(newShelf);
      wx.showToast({
        title: '创建书单成功',
        icon:'success',
        duration:1000

      })
      app.saveCache('bookShelf',obj)
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500);  

    }

})