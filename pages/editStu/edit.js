// pages/edit/edit.js
const app = getApp();
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
const Dialog = require("../../miniprogram_npm/@vant/weapp/dialog/dialog")
  .default;
const request = require("../../utils/util").request;
const qs = require("../../utils/util").qs;
const cronToTime = require("../../utils/util").cronToTime;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sid: null,
    stuid: null,
    password: null,
    taskid: null,
    taskname: null,
    taskinfo: null,
    isRun: null,
    school: null,
    loading: false,
    isShowTaskSelector: false,
    actions: [],
  },
  editStuId() {
    let that = this;
    that.setData({
      loading: true,
    });
    const { sid, stuid, password, isRun, taskid, school } = this.data;
    request(`/stuid/${sid}?id=${taskid}`, "PUT", {
      stuid,
      password,
      isRun,
      school,
    }).then((res) => {
      that.setData({
        loading: false,
      });
      Toast.success("修改成功");
      setTimeout(wx.navigateBack, 1500);
      wx.setStorageSync("isNeedHomeRefresh", "true");
      wx.setStorageSync("isNeedTaskRefresh", "true");
    });
  },
  gotoTaskPage() {},
  handSelectTask({ detail: task }) {
    this.setData({
      taskid: task.id,
      taskname: task.title,
      taskinfo: task,
      isShowTaskSelector: false,
    });
  },
  handleCheck({ detail }) {
    // console.log(e)
    this.setData({
      isRun: detail,
    });
  },
  oepnTaskSelector() {
    const {actions,sid} = this.data
    console.log(actions)
    if (actions && actions.length > 0) {
      this.setData({
        isShowTaskSelector: true,
      });
    } else {
      Dialog.confirm({
        title: "没有可选择的任务",
        message: "是否去添加签到任务？",
      })
        .then(() => {
          // on confirm
          wx.navigateTo({
            url: `/pages/editTask/edit?sid=${sid}&ctype=add`
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  closeTaskSelector() {
    this.setData({
      isShowTaskSelector: false,
    });
  },

  getTaskList() {
    let that = this;
    request(`/task?id=${app.globalData.userID}`, "GET").then(({ data }) => {
      console.log(data);
      const actions = data.map((task) => {
        task.time = cronToTime(task.cron);
        task.name = task.title;
        task.subname = task.address + " " + task.time;
        return task;
      });
      that.setData({
        actions,
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = that.getOpenerEventChannel();
    // eventChannel.emit("acceptDataFromOpenedPage", { data: "next page" });
    // eventChannel.emit("someEvent", { data: "next page" });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      const { stuid, password, isRun, id: sid, task, school } = data;
      if (task) {
      }
      that.setData({
        sid,
        stuid,
        password,
        isRun,
        school,
        taskid: task ? task.id : null,
        taskname: task ? task.title : null,
        taskinfo: task || null,
      });
    });
    this.getTaskList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTaskList();
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
