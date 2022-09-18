// pages/edit/edit.js
const app = getApp();
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
const Dialog = require("../../miniprogram_npm/@vant/weapp/dialog/dialog")
  .default;
const request = require("../../utils/util").request;
const cronToTimeA = require("../../utils/util").cronToTimeA;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sid: null,
    stuid: null,
    password: null,
    taskid: -1,
    isRun: null,
    school: null,
    delLoading: false,
    addLoading: false,
    isShowTaskSelector: false,
    actions: [],
    taskList: [],
    error: {
      stuid: "",
      pwd: "",
      school: "",
    },
  },
  editStuId() {
    let that = this;
    const { sid, stuid, password, isRun, taskList, school, error } = this.data;
    if (!sid) {
      Toast.fail("当前错误");
      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/splash/splash?page=/pages/index/index",
        });
      }, 800);
      return;
    }
    if (!stuid || !password || !school) {
      this.setData({
        error: {
          stuid: stuid ? "" : "账号不能为空",
          pwd: password ? "" : "账号不能为空",
          school: school ? "" : "账号不能为空",
        },
      });
      return;
    }
    that.setData({
      loading: true,
    });
    request(`/stuid/${sid}`, "PUT", {
      stuid,
      password,
      isRun,
      school,
      tasks: taskList
    }).then((res) => {
      console.log(res);
      that.setData({
        loading: false,
      });
      if (res.code) {
        Toast.fail("未配置任务");
      } else {
        Toast.success("修改成功");
        setTimeout(wx.navigateBack, 1500);
        wx.setStorageSync("isNeedHomeRefresh", "true");
        wx.setStorageSync("isNeedTaskRefresh", "true");
      }
    });
  },
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
    const { actions, sid } = this.data;
    console.log(actions);
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
            url: `/pages/editTask/edit?sid=${sid}&ctype=add`,
          });
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
  //   handleChooseTask({
  //     currentTarget: {
  //       dataset: { taskid },
  //     },
  //   }) {
  //     const { taskList } = this.data;
  //     this.setData({
  //       taskList: [...taskList, taskid + ""],
  //     });
  //   },
  onTasksChange(event) {
    this.setData({
      taskList: event.detail,
    });
  },
  deleteStuId() {
    const { sid, stuid } = this.data;
    Dialog.confirm({
      title: "确认删除",
      message: `是否要删除账号【${stuid}】？`,
    })
      .then(() => {
        // on confirm
        request(`/stuid/${sid}`, "DELETE").then((data) => {
          const msg = data.code === 0 ? "删除成功" : "删除失败"
          this.delayRAR(msg);
        });
      })
      .catch(() => {
        // on cancel
      });
  },
  getTaskList() {
    let { user } = this.data;
    if (!user.id) {
      Toast.fail("未登录，获取任务错误");
    }
    request(`/task?id=${user.id}`, "GET").then(({ data }) => {
      console.log(data);
      const actions = data.map((task) => {
        task.time = cronToTimeA(task.cron);
        task.name = task.title;
        task.subname = task.address + " " + task.time;
        return task;
      });
      console.log(actions);
      this.setData({
        actions,
      });
    });
  },

  /**
   * @description Delay Return And Refresh, 延迟返回并设置刷新原页面
   * @param message, the dialog message
   * @param reslut, the opration result
   * @param delay, return delay
   */
  delayRAR(message, reslut = true, delay = 1500) {
    if (reslut) {
      Toast.success(message);
    } else {
      Toast.fail(message);
    }
    setTimeout(wx.navigateBack, delay);
    wx.setStorageSync("isNeedHomeRefresh", "true");
    wx.setStorageSync("isNeedTaskRefresh", "true");
  },

  gotoTaskPage() {
    wx.navigateTo({
      url: "/pages/editTask/edit?ctype=add",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({ user: app.globalData.user });
    const eventChannel = that.getOpenerEventChannel();
    // eventChannel.emit("acceptDataFromOpenedPage", { data: "next page" });
    // eventChannel.emit("someEvent", { data: "next page" });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      const { stuid, password, isRun, id: sid, tasks, school } = data;
      const taskList = tasks.map((t) => t.id + "");
      that.setData({
        sid,
        stuid,
        password,
        isRun,
        school,
        taskList,
      });
    });
    this.getTaskList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
