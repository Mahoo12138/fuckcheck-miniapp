const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};
const subDomain = "/wechat/api";
const API_BASE_URL = "https://mahoo12138.cn"; // 主域名
// const API_BASE_URL = "https://192.168.0.100:3000"; // 主域名

const request = (url, method, data) => {
  let _url = API_BASE_URL + subDomain + url;
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync("token");
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      success(request) {
        resolve(request.data);
      },
      fail(error) {
        reject(error);
      },
      complete(aaa) {
        // 加载完成
      },
    });
  });
};

const qs = function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(function (key) {
      return ""
        .concat(encodeURIComponent(key), "=")
        .concat(encodeURIComponent(obj[key]));
    })
    .join("&");
};

// 06:20 => 0 20 6 * * *
const timeToCron = (t) => {
  const [hou, min] = t.split(":");
  return `0 ${min[0] == 0 ? min[1] : min} ${hou[0] == 0 ? hou[1] : hou} * * *`;
};
// ["06:20","09:00"] => 0 20 6 * * *|0 0 9 * * *
const timeAToCron = (time) => {
  console.log(time);
  if (typeof time !== "object") return;
  const arr = time.map(timeToCron);
  return arr.reduce((pre, cur) => pre + "|" + cur);
};
// 0 20 6 * * * => 06:20
const cronToTime = (c) => {
  const [, min, hou] = c.split(" ");
  return `${hou.length == 1 ? "0" + hou : hou}:${
    min.length == 1 ? "0" + min : min
  }`;
};
// 0 20 6 * * *|0 0 9 * * * => ["06:20","09:00"]
const cronToTimeA = (cron) => {
  return cron.split("|").map(cronToTime);
};
function timeFormatter(value) {
  var da = new Date(
    value.replace("/Date(", "").replace(")/", "").split("+")[0]
  );
  return (
    da.getFullYear() +
    "/" +
    (da.getMonth() + 1 < 10 ? da.getMonth() + 1 : da.getMonth() + 1) +
    "/" +
    (da.getDate() < 10 ? da.getDate() : da.getDate()) +
    " " +
    (da.getHours() < 10 ? "0" + da.getHours() : da.getHours()) +
    ":" +
    (da.getMinutes() < 10 ? "0" + da.getMinutes() : da.getMinutes()) +
    ":" +
    (da.getSeconds() < 10 ? "0" + da.getSeconds() : da.getSeconds())
  );
}

module.exports = {
  timeFormatter,
  cronToTimeA,
  timeAToCron,
  formatTime,
  cronToTime,
  timeToCron,
  request,
  qs,
};
