// pages/admin/admin.js

const Dialog = require("../../miniprogram_npm/@vant/weapp/dialog/dialog")
  .default;
const request = require("../../utils/util").request;
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
Page({
  data: {
    count: 1,
    amount: 1,
    allCards: [],
    otherCards: [],     // 筛选数据的载体
    showingCards: [],   // 当前数据的显示载体
    isShowAddCard: false,
    cardKind: ["MONTH"],
    type: "ALL",
    page: 1,
    unused: false,
    used: false,
    loading: false,
    over: false,    // 已记载所有日志标记
    none: false,    // 没有日志标志
    option: [
        { text: "全部卡密", value: "ALL" },
        { text: "月卡卡密", value: "MONTH" },
        { text: "周卡卡密", value: "WEEK" },
        { text: "日卡卡密", value: "DAY" },
        { text: "账号卡密", value: "ACCOUNT" },
      ],
  },

  onChangeType({ detail }) {
    this.setData({
      type: detail,
      page: 1,
      over: false,
    });
    if (detail !== "ALL") {
      request(`/card?type=${detail}&page=${this.data.page}`, "GET").then(
        ({ data }) => {
          this.setData({
            showingCards: data,
            otherCards: data,
          });
        }
      );
    } else {
      this.setData({
        showingCards: this.data.allCards,
      });
    }
  },
  onSelectChange(e) {
    this.setData({
      cardKind: e.detail,
    });
  },
  onCountChange(e) {
    this.setData({
      count: e.detail,
    });
  },
  onAmountChange(e) {
    console.log(e);
    this.setData({
      amount: e.detail,
    });
  },
  showAddCard() {
    const beforeClose = this.handleAddCard();
    Dialog({
      showCancelButton: "true",
      beforeClose,
    });
  },

  handleAddCard() {
    const that = this;
    return (action) =>
      new Promise((resolve) => {
        if (that.data.cardKind.length === 0) {
          Toast.fail({
            message: "选择卡密类型",
          });
          resolve(false);
          return;
        }
        if (action === "confirm") {
          const { cardKind, amount, count } = that.data;
          Promise.all(
            cardKind.map((type) => {
              return request(`/card`, "POST", {
                amount,
                type,
                count,
              });
            })
          )
            .then((status) => {
              let success = status.filter((s) => !!s.code),
                message = "添加成功";
              if (success.length !== 0) {
                message = "未知错误，添加失败";
              }
              Toast({
                message,
                forbidClick: true,
                loadingType: "spinner",
                position: "bottom",
              });
              that.initialData();
              resolve(true);
            })
            .catch((error) => {
              console.log("增加卡密", error);
              // error.map((s) => console.log(s));
              resolve(false);
            });
        } else {
          resolve(true);
        }
      });
  },
  initialData() {
    request("/card?page=1", "GET").then(({ data }) => {
    // 初始拉取一页所有卡密
      this.setData({
        loading: false,
        showingCards: data,
        otherCards: data,
        allCards: data,
        none: data.length ? false : true,
      });
    });
  },
  grabNextData(type) {
    const { page, showingCards, unused, used} = this.data;
    const status = (unused ^ used) ? unused : '';
    request(`/card?page=${page}&type=${type || ""}&status=${status}`, "GET").then(({ data }) => {
      if (data.length === 0) {
        this.setData({
          over: true,
          loading: false,
        });
      } else {
        this.setData({
          loading: false,
          none: false,
          showingCards: showingCards.concat(data),
          otherCards: showingCards.concat(data),
        });
      }
    });
  },
  refreshData(type) {
    request(`/card?page=1&type=${type || ""}`, "GET").then(({ data }) => {
      this.setData({
        over: false,
        loading: false,
        none: false,
        showingCards: data,
        otherCards: data,
        page: 1
      });
    });
  },
  onUsedChange({ detail }) {
    this.setData({ used: detail });
  },
  onUnUsedChange({ detail }) {
    this.setData({ unused: detail });
  },
  onSelectConfirm() {
    const { used, unused, otherCards } = this.data;
    this.selectComponent("#select").toggle();
    if (used && !unused) {
      const cards = otherCards.filter((card) => {
        if (card.status == true) return card;
      });
      console.log(cards);
      this.setData({
        showingCards: cards,
      });
    } else if (unused && !used) {
      const cards = otherCards.filter((card) => {
        if (card.status == false) return card;
      });
      console.log(cards);
      this.setData({
        showingCards: cards,
      });
    } else {
      this.setData({
        showingCards: this.data.otherCards,
      });
    }
  },
  handleDeleteCard({ target }) {
    const { id } = target.dataset;
    const { type } = this.data;
    request(`/card/${id}`, "DELETE").then((data) => {
      this.refreshData(type);
    });
  },
  onCopyText({ target }) {
    wx.setClipboardData({
      data: target.dataset.value,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: "复制成功",
            });
          },
        });
      },
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("bottom");
    const { type, page, over, none } = this.data;
    if (!over && !none) {
      this.setData({
        loading: true,
        page: page + 1,
      });
      this.grabNextData(type === "ALL" ? "" : type);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initialData();
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
