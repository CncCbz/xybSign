const axios = require("axios");
const { config } = require("../config.js");

const sendMsg = async (msg) => {
  axios
    .post(
      "https://qmsg.zendee.cn/send/" + config.qmsgKey,
      {
        msg,
        qq: config.qmsgTo,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((res) => {
      console.log("qmsg消息发送成功");
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { sendMsg };
