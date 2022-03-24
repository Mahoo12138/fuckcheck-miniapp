// 获取应用实例
const app = getApp();
const Dialog = require("../../miniprogram_npm/@vant/weapp/dialog/dialog")
  .default;
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
const cronToTimeA = require("../../utils/util").cronToTimeA;
const request = require("../../utils/util").request;
const qs = require("../../utils/util").qs;
Page({
  data: {
    actions: [
      {
        type: "default",
        text: "编辑",
      },
      {
        text: "删除",
        type: "assertive",
      },
    ],
    tasks: [],
    hidden: true,
  },
  scrollest: function ({detail}) {
    const that = this;
    // console.log(detail, wx.getSystemInfoSync().windowHeight)
    if (detail.scrollTop <= 0) {
      detail.scrollTop = 0;
    } else if (detail.scrollTop > wx.getSystemInfoSync().windowHeight) {
      detail.scrollTop = wx.getSystemInfoSync().windowHeight;
    }
    if (
      detail.scrollTop > this.data.scrollTop ||
      detail.scrollTop == wx.getSystemInfoSync().windowHeight
    ) {
      this.setData({
        hidden: false,
      });
    } else {
      this.setData({
        hidden: true,
      });
    }
    setTimeout(function () {
      that.setData({
        scrollTop: detail.scrollTop,
      });
    }, 0);
  },
  editCard({ detail, target }) {
    let that = this;
    console.log(target);
    const { stuid, ...task } = this.data.tasks[target.dataset.index];
    if (detail.action.type === "default") {
      const url = qs(task);
      console.log(stuid);
      wx.navigateTo({
        url:
          "/pages/editTask/edit?" +
          url +
          (stuid === null ? "" : `&sid=${stuid.id}`) +
          "&ctype=edit",
      });
    } else {
      Dialog.confirm({
        title: `是否删除【${task.title}】?`,
        message: `签到地点：${task.address}\n 签到时间：${task.time}`,
      })
        .then((res) => {
          if(stuid.length){
            Toast({
              message: "任务使用中，无法删除",
              position: "bottom"
            })
          }else{
            request("/task/" + task.id + `?id=${that.data.user.id}`, "DELETE")
            .then((res) => {
              Toast.success("删除成功");
              that.reFreshData();
            })
            .catch((err) => Toast.fail("删除失败"));
          }
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  addTask() {
    wx.navigateTo({
      url: "/pages/editTask/edit?ctype=add",
    });
  },

  reFreshData() {
    let that = this;
    request(`/task?id=${that.data.user.id}`, "GET").then(({ data }) => {
      console.log(data);
      that.setData({
        tasks: data.map((task) => {
          task.time = cronToTimeA(task.cron);
          return task;
        }),
      });
    });
  },

  handleType() {},
  onLoad() {
    this.checkLogin();
    this.reFreshData();
  },
  onShow() {
    this.getTabBar().init();
    if (wx.getStorageSync("isNeedTaskRefresh")) {
      this.reFreshData();
      wx.removeStorageSync("isNeedTaskRefresh");
    }

    if (!this.data.user.id) {
      this.checkLogin();
      this.setData({
        user: app.globalData.user,
      });
      this.reFreshData()
    }
  },
  checkLogin() {
    if (app.globalData.user.id) {
      this.setData({
        user: app.globalData.user,
      });
    } else {
      wx.navigateTo({
        url: "/pages/splash/splash?page=/pages/tasks/tasks",
      });
    }
  },
});
