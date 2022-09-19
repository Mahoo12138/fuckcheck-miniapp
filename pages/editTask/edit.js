// pages/editTask/edit.js
const app = getApp();
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
const request = require("../../utils/util").request;
const { txMapSdk } = require("../../utils/txmap");
const { cronToTime, timeAToCron } = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    sid: null,
    ctype: null,
    title: null,
    remark: null,
    time: ["07:00"],
    current: null,
    defaultTime: "12:30",
    type: "sign",
    typeName: "签到",
    latitude: 0,
    longitude: 0,
    address: null,
    loading: false,
    isShowtypePick: false,
    isShowtimePick: false,
    filter(type, options) {
      if (type === "minute") {
        return options.filter((option) => option % 2 === 0);
      }
      return options;
    },
    locationActions: [
      {
        name: "获取当前位置",
      },
      {
        name: "地图选点获取位置",
      },
    ],
    taskTypeActions: [
      {
        name: "签到",
      },
      {
        name: "查寝",
      },
      {
        name: "信息收集",
      },
    ],
  },
  showTypePicker() {
    this.setData({
      isShowtypePick: true,
    });
  },
  updateTaskType({ detail }) {
    const type = this.handleTaskType(detail.name);
    this.setData({ type, typeName: detail.name, isShowtypePick: false });
  },
  handleTaskType(type) {
    switch (type) {
      case "签到":
        return "sign";
      case "sign":
        return "签到";
      case "查寝":
        return "attendance";
      case "attendance":
        return "查寝";
      case "信息收集":
        return "collect";
      case "collect":
        return "信息收集";
    }
  },
  showTimePicker({ target }) {
      console.log(target)
    this.setData({
      current: target.dataset.id,
      defaultTime: target.dataset.time,
      isShowtimePick: true,
    });
  },
  cancelTypePicker() {
    this.setData({
      isShowtypePick: false,
    });
  },
  cancelTimePicker() {
    this.setData({
      isShowtimePick: false,
    });
  },
  handleTimePicker(e) {
    const { time, current } = this.data;
    time[current] = e.detail;
    console.log(e);
    this.setData({
      time,
      isShowtimePick: false,
    });
  },
  addTask() {
    let that = this;
    let {
      id,
      type,
      ctype,
      title,
      time,
      address,
      user,
      latitude,
      longitude,
    } = this.data;
    if (ctype !== "add" && !id) {
      Toast.fail("当前未登录");
      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/splash/splash?page=/pages/tasks/tasks",
        });
      }, 800);
      return;
    }
    if (!title && !time && !address) return;
    let url = `/task?id=${user.id}`,
      method = "POST",
      message = "添加成功";
    if (ctype === "edit") {
      (method = "PUT"), (url = `/task/${id}`);
      message = "更新成功";
    }
    const cron = timeAToCron(time);
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: "操作中…",
    });
    that.setData({
      loading: true,
    });
    request(url, method, {
      id,
      title,
      cron,
      address,
      type,
      latitude,
      longitude,
    })
      .then((data) => {
        console.log(data);
        Toast.clear();
        Toast.success(message);
        that.setData({
          loading: false,
        });
        setTimeout(() => {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
            taskid: data.id,
            taskname: data.title,
            taskinfo: data,
          });
          wx.navigateBack({
            delta: 1, // 返回上一级页面。
          });
        }, 1500);
        wx.setStorageSync("isNeedTaskRefresh", "true");
      })
      .catch((err) => console.log(err));
  },

  onNumChange({ detail }) {
    const { time } = this.data;
    const len =
      time.length - detail > 0 ? time.length - detail : detail - time.length;
    if (detail > time.length) {
      for (let i = 0; i < len; i++) {
        time.push("06:00");
      }
      this.setData({ time });
    } else {
      for (let i = 0; i < len; i++) {
        time.pop();
      }
      this.setData({ time });
    }
  },

  chooseLocation() {
    const { latitude, longitude } = this.data;
    wx.chooseLocation({
      latitude,
      longitude,
      success: ({ latitude, longitude, address }) => {
        console.log("拾取的经纬度：", latitude, longitude);
        this.convertLocation(latitude, longitude, address);
      },
      fail: (res) => {
        console.log("地图选点出现错误");
      }
    });
  },
  getCurrentLocation() {
    let that = this;
    wx.getLocation({
      type: "gcj02",
      success({ latitude, longitude }) {
        that.convertLocation(latitude, longitude);
      },
    });
  },

  convertLocation(latitude, longitude, address) {
    const that = this;
    txMapSdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      success: function ({ result }) {
        let { lat, lng } = result.location;
        const xpi = (3.14159265358979324 * 3000.0) / 180.0;
        const z =
          Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xpi);
        const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xpi);
        lng = z * Math.cos(theta) + 0.0065;
        lat = z * Math.sin(theta) + 0.006;
        console.log("转换后的经纬度：", lat, lng);
        that.setData({
          latitude: lat,
          longitude: lng,
          address: address || result.address,
        });
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.ctype === "edit") {
      Object.keys(options).forEach((key) => {
        options[key] = decodeURIComponent(options[key]);
      });

      options.cron = options.cron.split("|");

      const time = options.cron.map((cron) => {
        return cronToTime(cron);
      });
      const typeName = this.handleTaskType(options.type);
      this.setData({
        typeName,
        ...options,
        time,
      });
    } else {
      this.setData({ ...options });
    }
    this.setData({
      user: app.globalData.user,
    });
  },
  onReady: function () {
    if (!this.data.address) {
      this.getCurrentLocation();
    }
  },

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
