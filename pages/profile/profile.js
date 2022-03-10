// 获取应用实例
const app = getApp();

Page({
  data: {
    nickname: null,
    avatar: null,
    num: 0
  },
  onContact (e) {
	console.log(e.detail.path)
	console.log(e.detail.query)
},
  onLoad() {
    const nickname = wx.getStorageSync('nickName')
    const avatar = wx.getStorageSync('avatarUrl')
    this.setData({
      nickname,
      avatar,
      num: app.globalData.num
    });
  },
  onShow() {
    this.getTabBar().init();
  },
});
