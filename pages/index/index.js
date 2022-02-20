// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    background: ['广告位1', '广告位2', '广告位3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2500,
    duration: 500
  },
  onChange(event) {
    console.log("das");
    this.setData({ active: event.detail });
    wx.showToast({
      title: `点击标签 ${event.detail + 1}`,
      icon: "none",
    });
    wx.navigateTo({
      //目的页面地址
      url: `pages/${event.detail}/${event.detail + 1}`,
      success: function(res){
        console.log(`pages/${event.detail}/${event.detail + 1}`)
      },
  })
  },
  bindViewTap() {
    wx.navigateTo({
      url: "../logs/logs",
    });
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },
  onShow() {
		this.getTabBar().init();
	},
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  }
});
