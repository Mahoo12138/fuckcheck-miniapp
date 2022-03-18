// 获取应用实例
const app = getApp();

Page({
  data: {
    nickname: null,
    avatar: null,
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
      user: app.globalData.user
    });
  },
  onShow() {
    this.getTabBar().init();
    this.setData({
      user: app.globalData.user
    });
  },
});
