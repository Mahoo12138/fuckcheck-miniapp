// 获取应用实例
const app = getApp();
const Dialog = require("../../miniprogram_npm/@vant/weapp/dialog/dialog")
  .default;
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
const cronToTime = require("../../utils/util").cronToTime;
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
  },
  editCard({ detail, target }) {
    let that = this;
    console.log(target);
    if (detail.action.type === "default") {
      const url = qs(this.data.tasks[target.dataset.index]);
      wx.navigateTo({
        url: "/pages/editTask/edit?" + url + "&ctype=edit",
      });
    } else {
      const task = this.data.tasks[target.dataset.index];
      Dialog.confirm({
        title: `是否删除“${task.title}”?`,
        message: `签到地点：${task.address}\n 签到时间：${task.time}`,
      })
        .then((res) => {
          console.log("删除成功");
          request("/task/" + task.id + `?id=${app.globalData.userID}`, "DELETE")
            .then((res) => {
              Toast("删除成功");
              that.reFreshData();
            })
            .catch((err) => Toast("删除失败"));
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
    request(`/task?id=${app.globalData.userID}`, "GET").then(({ data }) => {
      console.log(data);
      that.setData({
        tasks: data.map((task) => {
          task.time = cronToTime(task.cron);
          return task;
        }),
      });
    });
  },

  handleType(){
    
  },
  onLoad() {
    this.reFreshData();
  },
  onShow() {
    this.getTabBar().init();
    if (wx.getStorageSync("isNeedTaskRefresh")) {
      this.reFreshData();
      wx.removeStorageSync("isNeedTaskRefresh");
    }
  },
});
