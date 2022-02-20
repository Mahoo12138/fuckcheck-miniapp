// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    // wx.login({
    //   success: (res) => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     // console.log(res);
    //     if (res.code) {
    //       wx.request({
    //         url: "http://192.168.123.143:8080/api/login",
    //         data: {
    //           code: res.code,
    //         },
    //         method: "POST",
    //         header: { "content-type": "application/json" },
    //         success: function (data) {
    //           console.log(data)
    //         },
    //       });
    //     }
    //   },
    // });
  },
  globalData: {
    isLogin: false,
    userInfo: null,
  },
});
