// 获取应用实例
const app = getApp();

// pages/splash.js
Page({
  data: {},
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

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
