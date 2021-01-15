//app.js
 
App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    openid:'',
    roomId:'',
    userInfo:'',
  
    // backUrl:'http://127.0.0.1:8086/search/movies?',
    backUrl:'https://movie.bupt.ltd/search/',
    // backUrl:'http://81.70.149.182:8086/search/',
    // backUrl:'http://39.107.61.165:10020/search/?'

    // 2021年1月11日
    predictUrl:'https://movie.bupt.ltd/moviePredictionPage'

    
    // backUrl:'http://10.0.1.6:8080/',
    // backUrl:'https://back.jyzero.club/',
  }
})