const { getHeaders } = require("./utils/xyb.js");
let { config, apis, reports } = require("./config.js");
const { sendMsg } = require("./utils/qmsg.js");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const md5 = require("blueimp-md5");

async function xybSign(config) {
  let results = "";
  const baseUrl = "https://xcx.xybsyw.com/";
  // const baseUrl2 = "https://app.xybsyw.com/";
  const $http = {
    get: function (url, data) {
      return axios
        .get((duration ? baseUrl2 : baseUrl) + url, {
          params: data,
          headers: {
            ...getHeaders(url, data),
            cookie,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    post: function (url, data) {
      return axios
        .post(baseUrl + url, data, {
          headers: {
            ...getHeaders(url, data),
            cookie,
          },
        })
        .then((res) => {
          if (res.data.code != "200") {
            throw new Error(res.data.msg);
          }
          return res.data.data;
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    upload: function (url, form) {
      return axios
        .post(url, form, {
          headers: {
            ...form.getHeaders(), // 设置适当的请求头
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    location: function (data) {
      return axios
        .get(apis.map, {
          params: data,
          headers: {
            "user-agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.info != "OK") {
            throw new Error(res.data.info);
          }
          return res.data.regeocode;
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
  };
  let cookie = "JSESSIONID=6C7149CD82913F66EA0E66B52CDC9DD1";
  let accountInfo = {
    loginer: "姓名",
    loginerId: "6666666",
    ip: "1.1.1.1",
  };
  const SIGN_STATUS = {
    IN: 2,
    OUT: 1,
  };

  const login = async () => {
    console.log(">> 执行登录");
    const { sessionId, loginerId, loginKey } = await $http.post(apis.login, {
      username: config.username,
      password: config.password,
      openId: config.openId,
      unionId: config.unionId,
      model: "Macmini9,1",
      brand: "apple",
      platform: "mac",
      system: "Mac",
      deviceId: "",
    });
    cookie = "JSESSIONID=" + sessionId;
    accountInfo.loginerId = loginerId;
  };

  const getProjects = async () => {
    console.log(">> 获取实习项目");
    const projects = await $http.post(apis.projects, {});
    return (
      projects
        // .filter((project) => !project.practiceEnd)
        .map((project) => {
          return {
            moduleId: project.moduleId,
            planId: project.planId,
            planName: project.planName,
            projectRuleId: project.projectRuleId,
          };
        })
    );
  };

  const getTasks = async () => {
    console.log(">> 获取任务列表");
    const projects = await getProjects();
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const taskInfo = await $http.post(apis.tasks, {
        moduleId: project.moduleId,
        planId: project.planId,
        projectRuleId: project.projectRuleId,
      });
      projects[i] = {
        ...project,
        ...taskInfo,
      };
    }
    return projects;
  };

  const doTasks = async (taskInfos) => {
    console.log(">> 执行任务");
    let results = [];
    for (let task of taskInfos) {
      if (task.needSign) {
        results.push(`${config.modeCN}:`);
        if (config.sign) {
          try {
            const { data } = await doClock(task);
            results.push(data);
          } catch (err) {
            results.push(`${config.modeCN}失败${err}`);
          }
        } else {
          results.push(`未开启自动${config.modeCN}`);
        }
      }
      if (task.needWeekBlogs) {
        // console.log("填写周报:");
        results.push("填写周报:");
        if (config.needReport) {
          try {
            let weekBlogRes = await doWeekBlogs(task);
            if (weekBlogRes) {
              results.push(weekBlogRes);
            } else {
              results.push("无");
            }
          } catch (err) {
            results.push(`填写周报失败${err}`);
          }
        } else {
          results.push("未开启自动填写周报");
          // console.log("未开启自动填写周报");
        }
      }
    }
    if (!results.length) {
      return "今日没有还未完成的任务";
    }
    return results.join("\n");
  };

  // 写周报
  const doWeekBlogs = async (taskInfo) => {
    const { planVo } = await $http.post(apis.weekBlogStatus, {
      blogType: 1,
      planId: taskInfo.planId,
    });
    const traineeId = planVo?.traineeId;
    const date = await $http.post(apis.weekReportsDate, { traineeId });
    const blogDates = [];
    for (let { id, months } of date) {
      for (let month of months) {
        blogDates.push({ year: id, month: month.id });
      }
    }
    console.log(
      "*需要写周报的月份有*\n",
      blogDates.map((val) => `${val.year}.${val.month}`).join("\n")
    );
    const blogTasks = [];
    for (let { year, month } of blogDates) {
      blogTasks.push(...(await getBlogTasks(year, month, traineeId)));
    }
    console.log(
      "*需要写的周报有*\n",
      blogTasks
        .map((val) => `第${val.week}周(${val.startDate}-${val.endDate})`)
        .join("\n")
    );
    const results = [];
    for (let blogTask of blogTasks) {
      const res = await submitBlog(traineeId, blogTask);
      // console.log(`第${blogTask.week}周周报上交${res ? "成功" : "失败"}`);
      results.push(`第${blogTask.week}周周报上交${res ? "成功" : "失败"}`);
    }
    return results.join("\n");
  };

  const getBlogTasks = async (year, month, traineeId) => {
    const data = await $http.post(apis.weekReports, {
      traineeId,
      year,
      month,
      id: "",
    });
    // console.log({ data });
    return data.filter((item) => item.status == 2);
  };
  const submitBlog = async (traineeId, blogTask) => {
    const blogType = 1;
    const blogs = reports[blogTask.week - 1];
    console.log(">> 保存周报");
    if (!blogs || !blogs.length) {
      return false;
    }
    const id = await $http.post(apis.weelBlogSave, {
      blogType,
      blogTitle: "实习周记",
      blogBody: blogs[Math.round(Math.random() * (blogs.length - 1))],
      blogOpenType: 2,
      traineeId: traineeId,
      isDraft: 0,
      startDate: blogTask.startDate,
      endDate: blogTask.endDate,
      backgroundTemplateId: 0,
      fileJson: "",
      blogId: "undefined",
    });
    console.log(">> 提交周报");
    const { submitNum } = await $http.post(apis.weelBlogSubmit, {
      blogType,
      traineeId,
    });
    return submitNum > 0;
  };

  // 签到/签退
  const doClock = async (taskInfo) => {
    const resp = await $http.post(apis.clockDefault, {
      planId: taskInfo.planId,
    });
    const { clockVo, unStartClockVo } = resp;
    const traineeId = clockVo?.traineeId || unStartClockVo?.traineeId;
    console.log(">> 获取traineeId成功：", traineeId);
    const { res, postInfo, isSignin, isSignout } = await getClockInfo(
      traineeId
    );
    postInfo.traineeId = traineeId;
    console.log("*签到模式*\n", config.modeCN);
    if (config.mode === "in") {
      //执行签到模式
      if (isSignin) {
        if (config.reSign) {
          if (!isSignout) {
            console.log("已签到,重新签到");
            const form = await getClockForm(postInfo, SIGN_STATUS.IN);
            return await updateClock(form);
          } else {
            return {
              res: true,
              data: "已签退,无法进行签到",
            };
          }
        } else {
          return {
            res: true,
            data: "已签到,未开启重新签到",
          };
        }
      } else {
        // 首次签到
        const form = await getClockForm(postInfo, SIGN_STATUS.IN);
        // return await newClock(form);
        return await newClockOut(form);
      }
    } else {
      //执行签退模式
      if (isSignout) {
        if (config.reSign) {
          console.log("已签退,重新签退");
          const form = await getClockForm(postInfo, SIGN_STATUS.OUT);
          return await updateClock(form);
        } else {
          return {
            res: true,
            data: "已签退,未开启重新签退",
          };
        }
      } else {
        //首次签退
        const form = await getClockForm(postInfo, SIGN_STATUS.OUT);
        return await newClockOut(form);
        // const { isSignout: success } = await getClockInfo(traineeId);
        // return {
        //   res: success,
        //   data: success ? "签退成功" : "签退失败",
        // };
      }
    }
  };
  const getClockInfo = async (traineeId) => {
    const { clockInfo, postInfo, canSign } = await $http.post(
      apis.clockDetail,
      {
        traineeId,
      }
    );
    console.log(">> 获取签到表单成功：");
    if (!canSign) {
      console.log("当前无法签到!!");
      return {
        res: 0, //0表示当前无法签到
        data: "当前无法签到",
      };
    }
    const { inStatus, outStatus, inTime, outTime } = clockInfo; //TODO 用inStatus和outStatus来判断是否已签到
    return {
      res: !!inTime ? -1 : 1, //-1表示已签到,1表示未签到
      postInfo,
      isSignin: !!inTime,
      isSignout: !!outTime,
    };
  };
  const updateClock = async (form) => {
    await $http.post(apis.clockUpdate, form);
    return {
      res: true,
      data: `已重新${config.modeCN}`,
    };
  };
  const newClock = async (form) => {
    // await duration();
    const { successCount } = await $http.post(apis.clock, form);
    const success = successCount > 0;
    return {
      res: success,
      data: `${config.modeCN}${success ? "成功" : "失败"}`,
    };
  };
  const newClockOut = async (form) => {
    // await duration();
    const { startTraineeDayNum, signPersonNum } = await $http.post(
      apis.clockNew,
      form
    );
    return {
      res: true,
      data: `${config.modeCN}成功,当前为${config.modeCN}的第${startTraineeDayNum}天，共${config.modeCN}${signPersonNum}人`,
    };
  };

  const getClockForm = async (postInfo, signStatus) => {
    const isCustom = !!config.location;
    let lat = "",
      lng = "";
    if (isCustom) {
      [lng, lat] = config.location.split(",");
    } else {
      ({ lat, lng } = getRandomCoordinates(
        postInfo.lat,
        postInfo.lng,
        postInfo.distance
      )); //生成随机经纬度
    }

    const { adcode, formatted_address } = await getAdcode({
      key: "c222383ff12d31b556c3ad6145bb95f4",
      location: config.location || `${lng},${lat}`,
      extensions: "all",
      s: "rsx",
      platform: "WXJS",
      appname: "c222383ff12d31b556c3ad6145bb95f4",
      sdkversion: "1.2.0",
      logversion: "2.0",
    });

    if (!formatted_address) {
      throw new Error("获取自定义位置失败, 请检查");
    }

    let result = {
      traineeId: postInfo.traineeId,
      adcode: adcode,
      lat,
      lng,
      address: isCustom ? formatted_address : postInfo.address || "",
      deviceName: getDeviceName() || "Macmini9,1",
      punchInStatus: 1,
      clockStatus: signStatus,
      addressId: postInfo.addressId,
      imgUrl: "",
      reason: "",
    };
    let imgUrl = "";
    if (config.signImagePath) {
      try {
        imgUrl = await clockUpload(config.signImagePath);
      } catch (error) {
        console.log("上传图片失败");
      }
      result.imgUrl = imgUrl;
      result.reason = "签到";
    }
    return result;
  };

  //获取用户信息
  const getAccountInfo = async () => {
    const { loginer } = await $http.post(apis.accountInfo);
    accountInfo.loginer = loginer;
  };
  //获取邮政编码
  const getAdcode = async (data) => {
    try {
      const res = await $http.location(data);
      const { addressComponent, formatted_address } = res || {};
      const { adcode } = addressComponent || {};
      return {
        adcode,
        formatted_address,
      };
    } catch (error) {
      return {
        adcode: "",
        formatted_address: "",
      };
    }
  };

  const clockUpload = async (path) => {
    const {
      accessid: OSSAccessKeyId,
      callback,
      dir,
      expire,
      policy,
      signature,
      success_action_status,
      host,
    } = await $http.post(apis.uploadInfo, {
      customerType: "STUDENT",
      uploadType: "UPLOAD_STUDENT_CLOCK_IMGAGES",
      publicRead: true,
    });
    const key = `${dir}/${expire}.jpeg`;
    const formData = new FormData();
    formData.append("key", key);
    formData.append("OSSAccessKeyId", OSSAccessKeyId);
    formData.append("policy", policy);
    formData.append("signature", signature);
    formData.append("callback", callback);
    formData.append("success_action_status", success_action_status);
    const fileStream = fs.createReadStream(path);
    // 将文件添加到FormData对象
    formData.append("file", fileStream, {
      filename: `${expire}.jpeg`, // 自定义文件名
    });
    const { status, vo } = await $http.upload(host, formData);
    return vo?.key;
  };

  const duration = async () => {
    await $http.post(
      apis.duration,
      {
        fromType: "",
        urlParamsStr: "",
        app: "wx_student",
        appVersion: "1.6.36",
        userId: accountInfo.loginerId,
        deviceToken: config.openId,
        userName: accountInfo.loginer,
        operatingSystemVersion: "10",
        deviceModel: "microsoft",
        operatingSystem: "android",
        country: "none",
        province: "none",
        city: "none",
        screenHeight: "736",
        screenWidth: "414",
        eventTime: Math.floor(Date.now() / 1000),
        pageId: "5",
        pageUrl: "growUp/pages/sign/sign/sign",
        preferName: "成长",
        pageName: "成长-签到",
        preferPageId: "2",
        preferPageUrl: "pages/growup/growup",
        stayTime: "8",
        eventType: "read",
        eventName: "none",
        clientIP: accountInfo.ip,
        reportSrc: "2",
        login: "1",
        netType: "WIFI",
        itemID: "none",
        itemType: "其他",
      },
      true
    );
  };
  const getIP = async () => {
    const { ip } = await $http.post(apis.ip);
    accountInfo.ip = ip;
    return ip;
  };

  const getDeviceName = () => {
    const deviceNames = [
      "iPhone 13 Pro",
      "MacBook Air",
      "Samsung Galaxy S21",
      "Amazon Echo Dot",
      "Sony PlayStation 5",
      "Canon EOS 5D Mark IV",
      "Fitbit Versa 3",
      "Google Nest Thermostat",
      "Logitech MX Master 3",
      "ASUS ROG Strix Gaming Laptop",
    ];
    // 生成一个随机的索引
    const randomIndex = Math.floor(Math.random() * deviceNames.length);
    // 获取随机设备名称
    const randomDeviceName = deviceNames[randomIndex];
    return randomDeviceName;
  };
  //生成一个随机经纬度
  function getRandomCoordinates(latitude, longitude, distanceInMeters = 10) {
    // 地球半径（单位：米）
    const earthRadius = 6378137; // 地球平均半径

    // 随机方向（0到360度）
    const randomDirection = Math.random() * 360;

    // 随机距离（0到distanceInMeters）
    const randomDistance = Math.random() * distanceInMeters;

    // 将距离转换为弧度
    const distanceInRadians = randomDistance / earthRadius;

    // 将方向转换为弧度
    const directionInRadians = randomDirection * (Math.PI / 180);

    // 原始坐标的经度和纬度（弧度）
    const originalLatitudeRadians = latitude * (Math.PI / 180);
    const originalLongitudeRadians = longitude * (Math.PI / 180);

    // 使用Haversine公式计算新坐标的经度和纬度
    const newLatitudeRadians = Math.asin(
      Math.sin(originalLatitudeRadians) * Math.cos(distanceInRadians) +
        Math.cos(originalLatitudeRadians) *
          Math.sin(distanceInRadians) *
          Math.cos(directionInRadians)
    );

    const newLongitudeRadians =
      originalLongitudeRadians +
      Math.atan2(
        Math.sin(directionInRadians) *
          Math.sin(distanceInRadians) *
          Math.cos(originalLatitudeRadians),
        Math.cos(distanceInRadians) -
          Math.sin(originalLatitudeRadians) * Math.sin(newLatitudeRadians)
      );

    // 将新的经纬度坐标转换为度数，并保留与传入参数相同的小数位数
    const newLatitude = parseFloat(newLatitudeRadians * (180 / Math.PI));
    const newLongitude = parseFloat(newLongitudeRadians * (180 / Math.PI));

    return { lat: newLatitude, lng: newLongitude };
  }

  const xyb = async () => {
    try {
      await login();
      await getAccountInfo();
      // await duration();
      await getIP();
    } catch (err) {
      results += `### 账号(${config.username.substr(
        config.username.length - 4
      )}) ###\n${err}\n`;
      return;
    }
    const tasks = await getTasks();
    const result = await doTasks(tasks);
    results += `###${accountInfo.loginer}###
${result}`;
    // await sendMsg(result);
  };
  await xyb();
  return results;
}

const parseEnvArgv = (argv) => {
  const arguments = argv;
  let res = {
    accounts: [],
  };

  if (!argv[2]) {
    return false;
  }
  const configStrArr = argv[2].split(";");
  const accountStrs = [];
  const configStrs = [];
  for (const confStr of configStrArr) {
    if (!confStr) {
      continue;
    }
    if (confStr.includes("username")) {
      accountStrs.push(confStr);
    } else {
      configStrs.push(confStr);
    }
  }
  for (const acStr of accountStrs) {
    const info = {};
    const acs = acStr.split("&");
    for (const c of acs) {
      const cache = c.split("=");
      if (
        cache[0] == "sign" ||
        cache[0] == "reSign" ||
        cache[0] == "needReport"
      ) {
        info[cache[0]] = cache[1] == "true" ? true : false;
      } else {
        info[cache[0]] = cache[1];
      }
    }
    res.accounts.push(info);
  }
  for (const cfs of configStrs) {
    const cache = cfs.split("=");
    res[cache[0]] = cache[1];
  }
  return res;
};

async function run() {
  let results = [];

  let processConfig = parseEnvArgv(process.argv);
  if (processConfig) {
    console.log("====使用命令行配置====");
    const confTemp = {
      username: "",
      password: "",
      openId: "",
      unionId: "",
      sign: true,
      reSign: false,
      location: "",
      signImagePath: "",
      needReport: false,
    };
    processConfig.accounts = processConfig.accounts.map((e) => ({
      ...confTemp,
      ...e,
    }));
    const modeMap = {
      in: "签到",
      out: "签退",
    };
    processConfig.modeCN = modeMap[processConfig.mode];
    config = processConfig;
  } else {
    console.log("====使用config.js中配置====");
  }

  for (const account of config.accounts) {
    // console.log(account);
    account.mode = config.mode;
    account.modeCN = config.modeCN;
    account.password = md5(account.password);
    results.push(await xybSign(account));
    console.log(`====当前账号(${account.username})执行结束====`);
  }
  console.log("====所有账号执行结束====");
  console.log(results.join("\n"));
  if (config.qmsgKey) {
    await sendMsg(results.join("\n"), config);
  }
}

run();
