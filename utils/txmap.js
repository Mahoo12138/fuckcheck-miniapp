const QQMapWX = require("../libs/qqmap-wx-jssdk.min.js");
const key = "L7OBZ-IK2CX-CYK4I-T57P6-AV32T-HOFKP";

const txMapSdk = new QQMapWX({
  key,
});

module.exports = { txMapSdk };
