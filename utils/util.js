const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const subDomain = '/api'
// const API_BASE_URL = 'https://api.mahoo12138.cn'  // 主域名
const API_BASE_URL = 'https://192.168.0.101:3000'  // 主域名


const request = (url, method, data) => {
  let _url = API_BASE_URL + subDomain  + url
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

const qs = function objectToQueryString(obj) {
  return Object.keys(obj).map(function (key) {
    return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj[key]));
  }).join('&');
};

const timeToCron = (time) => {
  const [hou,min]=time.split(':')
  return `0 ${min[0]==0?min[1]:min} ${hou[0]==0?hou[1]:hou} ? * *`
}
const cronToTime = (cron) => {
  const [,min,hou] = cron.split(' ')
  return `${hou.length==1?'0'+hou:hou}:${min.length==1?'0'+min:min}`
}
module.exports = {
  formatTime,
  cronToTime,
  timeToCron,
  request,
  qs
}
