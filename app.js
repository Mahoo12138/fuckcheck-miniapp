// app.js
App({
  onLaunch() {
    let that = this
    // 展示本地存储能力
    // const logs = wx.getStorageSync("logs") || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync("logs", logs);
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        if (res.code) {
          wx.request({
            url: "https://api.mahoo12138.cn/api/auth/login",
            // url: "https://192.168.0.101:3000/api/auth/login",

            data: res,
            method: "POST",
            header: { "content-type": "application/json" },
            success: function ({data}) {
              // console.log("发送登录请求成功")
              console.log(data)
              that.globalData.isLogin = true
              that.globalData.user = data.user
              wx.setStorageSync("token", data.access_token)
              wx.switchTab({
                url: "/pages/index/index",
              });
            },
            fail: function(res){
              that.globalData.isLogin = false
              console.log(res)
            }
          });
        }
      },
      fail: (err)=>{
        console.log("登陆失败")
        console.log(err)
      }
    });
  },
  globalData: {
    isLogin: null,
    num: 0,
    user: {}
  },
});
