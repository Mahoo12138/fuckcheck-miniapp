// 获取应用实例
const app = getApp();
const request = require("../../utils/util").request;
// pages/splash.js
Page({
  data: {
    isLogin: null,
    page: "/pages/index/index",
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: "获取你的昵称、头像、地区及性别",
      success: (res) => {
        console.log(res);
        app.globalData.userInfo = res.userInfo;
        wx.switchTab({
          url: "/pages/index/index",
        });
      },
      fail: (res) => {
        console.log(res);
        //拒绝授权
        wx.showToast({
          title: "没法玩了！",
          icon: "error",
          duration: 2000,
        });
        return;
      },
    });
  },
  retryLogin() {
    this.setData({
      isLogin: null,
    });
    this.handleLogin();
  },
  handleLogin() {
    const that = this;
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        if (res.code) {
          request("/auth/login", "POST", res)
            .then((data) => {
              console.log("发送登录请求成功");
              console.log(data);
              if (data.user) {
                app.globalData.user = data.user;
                wx.setStorageSync("token", data.access_token);
                wx.switchTab({
                  url: that.data.page,
                });
                return
              }
              console.log("登陆失败1");
              this.setData({
                isLogin: false,
              });
            })
            .catch((err) => {
              app.globalData.isLogin = false;
              console.log(res);
            });
        }
      },
      fail: (err) => {
        console.log("登陆失败2");
        console.log(err);
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ page }) {
    if (page) {
      this.setData({
        page,
      });
    }
    this.handleLogin();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
