// pages/push/push.js
// 获取应用实例
const app = getApp();
const request = require("../../utils/util").request;
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pptoken: null,
    error: null,
    loading: false,
  },
  updateToken(e) {
    const { pptoken, user } = this.data;
    if (pptoken) {
      request(`/user/${user.id}`, "PUT", {
        pptoken,
      }).then((data) => {
        if (data.code === 0) {
          Toast.success("操作成功");
          this.setData({
            user: { ...user, pptoken: this.secretToken(pptoken) },
            pptoken: null,
          });
        }
      });
    } else {
      this.setData({
        error: "token 不能为空",
      });
    }
  },
  onChangePush({ detail }) {
    const { user } = this.data;
    wx.showModal({
      title: "提示",
      content: "是否切换消息推送总开关？",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            loading: true,
          });
          request(`/user/${user.id}`, "PUT", {
            push: detail,
          }).then((data) => {
            if (data.code === 0) {
              Toast.success("操作成功");
              app.globalData.user.push = detail;
              this.setData({ user: { ...user, push: detail }, loading: false });
            }
          });
        }
      },
    });
  },
  cancelError() {
    this.setData({
      error: null,
    });
  },
  secretToken(token) {
    if (!token) return null;
    const front = token.substr(0, 6);
    const end = token.substr(-6);
    return `${front}********${end}`;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const {user} = app.globalData
    this.setData({
      user: {...user,pptoken: this.secretToken(user.pptoken)},
    });
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
