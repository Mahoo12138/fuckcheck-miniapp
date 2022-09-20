// pages/service/service.js
const app = getApp();
const request = require("../../utils/util").request;
const timeFormater = require("../../utils/util").timeFormatter;
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    card: null,
  },
  useCard() {
    request(`/user/${app.globalData.user.id}`, "POST", {
      value: this.data.value,
    }).then((data) => {
      if (data.code) {
        Toast.fail({
          message: data.message,
        });
      } else {
        const { expireDate, stu_amount } = data.data;
        app.globalData.user.expireDate = expireDate;
        app.globalData.user.stu_amount = stu_amount;
        this.setData({ ...data.data, expireDate: timeFormater(expireDate) });
        Toast({
          message:data.message,
          forbidClick: true,
          loadingType: "spinner",
          position: "bottom",
        });
      }
    });
  },
  onChange({ detail }) {
    this.setData({
      value: detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { user } = app.globalData;
    this.setData({
      ...user,
      expireDate: timeFormater(user.expireDate),
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
