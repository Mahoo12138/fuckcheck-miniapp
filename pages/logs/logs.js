// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onClick(){
    console.log("click")
    wx.requestSubscribeMessage({
      tmplIds: ['MABYr9fVV31y25jB43j3bXLqW6ZdkBI7QxmmmkUvzsA'],
      success (res) {console.log(res) },
      fail(err){console.log(err)}
    })
  },
  onLoad() {
  },
  onShow(){
    
  }
})
