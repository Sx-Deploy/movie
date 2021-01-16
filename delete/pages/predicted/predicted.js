// pages/predicted/predicted.js
// import Notify from "@vant/weapp/dist/notify/notify.js";

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    words:'',
    list:[],
    flag:false,
    page:1,
    nextPage:2,
    prePage:0,
    type:'movies',
    title:'电影',
    name:'movies'
  },
  navi(e)
  {
    console.log(e)
    this.setData({
      // words: e.detail,
     
      name:e.detail.name,
      title:e.detail.title
   })

  },
  onChange(e) {
    console.log(e)
    // Notify({ type: 'primary', message: e.detail });
    this.setData({
       words: e.detail,
      
      //  name:e.detail.name
    })

    console.log(this.data.name)
    
    ;}
    ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // onSearch()
  // {
  //   var that = this
  //   wx.request({
  //     url: app.globalData.backUrl+'page=1&pageSize=10&type=1&words='+this.data.words,
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
      
  //     success: function (res) {
  //       console.log("successful！")
  //       var lis = res.data.movies;
  //       console.log(lis)
  //       for(var i in lis)
  //       {
  //           lis[i].movie.imageName="http://106.54.68.249:10025/movie_picture/"+lis[i].movie.imageName;
  //       }
  //         that.setData({
  //           list: lis,
  //           page:that.data.page
  //         })
          
         
  //     }
  //   })
  //   console.log('搜索' + this.data.words);
  // },
  onClick(e) {
    // if(e)
    // console.log("e"+e.currentTarget.dataset.cid)

    var that = this
   
    // console.log(this.data.page)
    // console.log(parseInt(e.currentTarget.dataset.cid))
    // var temp = parseInt(e.currentTarget.dataset.cid)
    if(e!=null)
    {
      if(parseInt(e.currentTarget.dataset.cid)!=10)
      {
        if(this.data.page+parseInt(e.currentTarget.dataset.cid)!=0)
        this.data.page+=parseInt(e.currentTarget.dataset.cid)
        if(e.currentTarget.dataset.cid==0)
        this.data.page = 1
      }
      else{
        this.data.words=''
        this.data.page = 1
      }
   
   
    }

    
    
    
    wx.request({
     
      url: app.globalData.backUrl+this.data.name+'?pageSize=10&type=1&words='+this.data.words+"&page="+this.data.page,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      
      success: function (res) {
        console.log("successful！")
        if(that.data.name=="movies"){
        var lis = res.data.movies;
        console.log(res)
        for(var i in lis)
        {
            lis[i].movie.imageName="http://106.54.68.249:10025/movie_picture/"+lis[i].movie.imageName;
        }
          that.setData({
            list:lis,
            page:that.data.page,
            flag:true
          })
        }
        else if(that.data.name=="directors")
        {
          console.log("successful！directors")
         
          var lis = res.data.directors;
          for(var i in lis)
          {
              lis[i].director.imageName="http://106.54.68.249:10025/movie_picture/"+lis[i].director.imageName;
          }
          console.log(res)
          that.setData({
            list:lis,
            page:that.data.page,
            flag:true
          })
        }

        else if(that.data.name=="actors")
        {
          console.log("successful！actors")
         
          var lis = res.data.actors;
          console.log(res)
          for(var i in lis)
          {
              lis[i].actor.imageName="http://106.54.68.249:10025/movie_picture/"+lis[i].actor.imageName;
          }
          that.setData({
            list:lis,
            page:that.data.page,
            flag:true
          })

        }
        else if(that.data.name=="scenarists")
        {
          console.log("successful！scenarists")
         
          var lis = res.data.scenarists;
          console.log(res)
          for(var i in lis)
          {
              lis[i].scenarist.imageName="http://106.54.68.249:10025/movie_picture/"+lis[i].scenarist.imageName;
          }
          that.setData({
            list:lis,
            page:that.data.page,
            flag:true
          })
        }
      
        
         
      } 
    })
    
    console.log('搜索' + this.data.words);
  },
//   showtime()
//   {
//     var that = this

//     console.log(this.data.page)
//     console.log(parseInt(e.currentTarget.dataset.cid))
// var temp = parseInt(e.currentTarget.dataset.cid)
//     if(this.data.page+temp!=0)
//     this.data.page+=parseInt(e.currentTarget.dataset.cid)
//     wx.request({
//       url: app.globalData.backUrl+'page=1&pageSize=10&type=1&words= ',
//       method: 'GET',
//       header: {
//         'content-type': 'application/json' // 默认值
//       },
      
  //     success: function (res) {
  //       that.data.flag=true
  //       console.log("successful！")
  //       var lis = res.data.movies;
  //       console.log(lis)
  //       for(var i in lis)
  //       {
  //           lis[i].movie.imageName="http://106.54.68.249:10025/movie_picture/"+lis[i].movie.imageName;
  //       }
  //         that.setData({
  //           list: lis
  //         })
          
         
  //     }
  //   })
  //   console.log('搜索' + this.data.words);
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  
    
    console.log(this.data.flag)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.onClick()
   
  },

  /** 
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})