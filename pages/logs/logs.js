// pages/admin/admin.js
const app = getApp();
const Dialog = require("../../miniprogram_npm/@vant/weapp/dialog/dialog")
  .default;
const request = require("../../utils/util").request;
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
Page({
  data: {
    otherLogs: [],
    allCards: [],
    showingLogs: [],
    option: [],
    stuid: 0,
    page: 1,
    success: false,
    fail: false,
    loading: false,
    none: null
  },

  onChangeStuid({ detail }) {
    this.setData({
      stuid: detail,
      page: 1,
      success: false,
      fail: false,
      over: false,
      none: false
    });
    if (detail !== "0") {
      request(`/log?stuid=${detail}&page=${this.data.page}`, "GET").then(
        ({ data }) => {
          this.setData({
            showingLogs: data,
            otherLogs: data,
          });
        }
      );
    } else {
      this.setData({
        showingLogs: this.data.allCards,
      });
    }
  },
  initialData() {
    request(`/log?page=1&user=${app.globalData.user.id}`, "GET").then(
      ({ data }) => {
        this.setData({
          loading: false,
          showingLogs: data,
          otherLogs: data,
          none: data.length === 0 ? true: false
        });
      }
    );
  },
  reFreshData(stuid) {
    const { page, showingLogs } = this.data;
    request(`/log?page=${page}&stuid=${stuid}&user=${app.globalData.user.id}`, "GET").then(({ data }) => {
      if (data.length === 0) {
        this.setData({
          over: true,
          loading: false,
        });
      } else {
        this.setData({
          loading: false,
          showingLogs: showingLogs.concat(data),
          otherLogs: showingLogs.concat(data),
        });
      }
    });
  },
  onSucceeChange({ detail }) {
    this.setData({ used: detail });
  },
  onFailChange({ detail }) {
    this.setData({ unused: detail });
  },
  onSelectConfirm() {
    const { used, unused, otherLogs } = this.data;
    this.selectComponent("#select").toggle();
    if (used && !unused) {
      const cards = otherLogs.filter((card) => {
        if (card.status == true) return card;
      });
      console.log(cards);
      this.setData({
        showingLogs: cards,
      });
    } else if (unused && !used) {
      const cards = otherLogs.filter((card) => {
        if (card.status == false) return card;
      });
      console.log(cards);
      this.setData({
        showingLogs: cards,
      });
    } else {
      this.setData({
        showingLogs: this.data.otherLogs,
      });
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("bottom");
    let { stuid, page, over } = this.data;
    if (!over) {
      this.setData({
        loading: true,
        page: page + 1,
      });
      this.reFreshData(stuid === 0 ? "" : stuid);
    }
  },
  getStuidInfo() {
    request(`/stuid?id=${app.globalData.user.id}`, "GET").then(({ data }) => {
      const option = [{ text: "全部账号日志", value: 0 }];
      this.setData({
        option: option.concat(
          data.map((stu) => {
            return { text: '账号: ' + stu.stuid, value: stu.id };
          })
        ),
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initialData();
    this.getStuidInfo();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
