// app.js
App({
  onLaunch() {
    let that = this
    // 展示本地存储能力
    // const logs = wx.getStorageSync("logs") || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync("logs", logs);
  },
  globalData: {
    num: 0,
    user: {}
  },
});
