// index.js
// const Notify = require('../../miniprogram_npm/@vant/weapp/notify/notify.js').default

const Dialog = require("../../miniprogram_npm/@vant/weapp/dialog/dialog")
  .default;
const Toast = require("../../miniprogram_npm/@vant/weapp/toast/toast").default;
const throttle = require("../../utils/util").throttle;

const request = require("../../utils/util").request;
// 获取应用实例
const app = getApp();

Page({
  data: {
    stuid: [],
    username: null,
    password: null,
    school: null,
    error: { username: "", password: "", school: "" },
    background: ["广告位1", "广告位2", "广告位3"],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2500,
    duration: 500,
  },
  handleManual: throttle(function(){
      request(`/user/run/${app.globalData.user.id}`,"GET").then(data => {
        if(data.code){
          Toast.success({
            message: "执行成功"
          })
        }else{
          Toast.fail({
            message: "请勿频繁执行"
          })
        }
      }).catch(err=>{
        Toast.fail({
          message: "未知错误，执行失败"
        })
      })
    }, 2000),
  handldAddStuId() {
    const that = this;
    return (action) =>
      new Promise((resolve) => {
        if (action === "confirm") {
          const { username: stuid, password, school } = that.data;
          if (!stuid || !password) {
            that.setData({
              error: {
                username: stuid ? "" : "账号不能为空",
                password: password ? "" : "密码不能为空",
                school: school ? "" : "学校不能为空",
              },
            });
            resolve(false);
            return;
          }
          // console.log("handle account: " + stuid);
          request(`/stuid?id=${that.data.user.id}`, "POST", {
            stuid,
            password,
            school,
          }).then((data) => {
            let message = "添加成功";
            if (data.code === 200) {
              setTimeout(() => {
                that.setData({ username: null, password: null, school: null });
                that.reFreshData();
              }, 500);
            } else {
              message = `添加失败: ${data.message}`;
              resolve(false);
            }
            Toast({
              message,
              forbidClick: true,
              loadingType: "spinner",
              position: "bottom",
            });
            resolve(true);
          });
        } else {
          // console.log("点击了取消");
          resolve(true);
          that.setData({
            username: null,
            password: null,
            school: null,
            error: {},
          });
        }
      });
  },
  onClose() {
    this.setData({
      showAddDialog: false,
    });
  },
  editStuId({ target }) {
    // console.log(target.dataset.index);
    let stu = this.data.stuid[target.dataset.index];
    wx.navigateTo({
      url: "/pages/editStu/edit",
      events: {
        acceptDataFromOpenedPage: function (data) {
          // console.log(data);
        },
      },
      success: function (res) {
        res.eventChannel.emit("acceptDataFromOpenerPage", stu);
      },
    });
  },
  addStuId() {
    const beforeClose = this.handldAddStuId();
    Dialog({
      title: "添加账号",
      showCancelButton: "true",
      beforeClose,
    });
  },
  async reFreshData() {
    const stuid = await request(
      `/stuid?id=${app.globalData.user.id}`,
      "GET"
    ).then(({ data }) => {
      // console.log(data);
      return data;
    });
    if (stuid.length !== 0) {
      app.globalData.user.num = stuid.length;
      for (let i of stuid) {
        console.log(i)
        if (i.stuid) {
          await request(`/log?stuid=${i.id}`, "GET").then(({ data }) => {
            console.log(data);
            if (data && data[0]) {
              // console.log(
              //   (new Date().getTime() - Date.parse(data[0].time)) /
              //     (1000 * 60 * 60)
              // );
              if (
                (new Date().getTime() - Date.parse(data[0].time)) /
                  (1000 * 60 * 60) >
                24
              ) {
                i.status = null;
              } else {
                i.status = data[0].status;
              }
            }
          });
        }
      }
      // debugger
      // console.log(stuid);
      this.setData({ stuid });
    }
  },
  onLoad() {
    this.reFreshData();
    let that = this;
    const nickname = wx.getStorageSync("nickName");
    that.setData({
      user: app.globalData.user,
    });
    if (!nickname) {
      wx.showModal({
        title: "温馨提示",
        content: "亲，授权微信登录后才能正常使用小程序功能",
        success(res) {
          //如果用户点击了确定按钮
          if (res.confirm) {
            wx.getUserProfile({
              desc: "获取你的昵称、头像、地区及性别",
              success: (res) => {
                // console.log(res);
                wx.setStorageSync("nickName", res.userInfo.nickName);
                wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl);
              },
              fail: (res) => {
                // console.log(res);
                //拒绝授权
                wx.showToast({
                  title: "没法玩了！",
                  icon: "error",
                  duration: 2000,
                });
                return;
              },
            });
          } else if (res.cancel) {
            //如果用户点击了取消按钮
            wx.showToast({
              title: "这样不好哦",
              icon: "error",
              duration: 2000,
            });
            return;
          }
        },
      });
    }
  },
  onReady() {},
  onShow() {
    let that = this;
    this.getTabBar().init();
    if (wx.getStorageSync("isNeedHomeRefresh")) {
      this.reFreshData();
      wx.removeStorageSync("isNeedHomeRefresh");
    }
  },
});
