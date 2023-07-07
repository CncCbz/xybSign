const { getHeaders } = require("./utils/xyb.js");
const { config, apis, reports } = require("./config.js");
const { sendMsg } = require("./utils/qmsg.js");
const axios = require("axios");

let cookie = "JSESSIONID=6C7149CD82913F66EA0E66B52CDC9DD1";
const baseUrl = "https://xcx.xybsyw.com/";

const $http = {
  get: function (url, data) {
    return axios
      .get(baseUrl + url, {
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
        console.log(err);
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
        return res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

const login = async () => {
  console.log("=== 执行登录 ===");
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
};

const getProjects = async () => {
  console.log("=== 获取实习项目 ===");
  const projects = await $http.post(apis.projects, {});
  return projects
    .filter((project) => !project.practiceEnd)
    .map((project) => {
      return {
        moduleId: project.moduleId,
        planId: project.planId,
        planName: project.planName,
        projectRuleId: project.projectRuleId,
      };
    });
};

const getTasks = async () => {
  console.log("=== 获取任务列表 ===");
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
  console.log("=== 执行任务 ===");
  let results = [];
  for (let task of taskInfos) {
    if (task.needWeekBlogs) {
      let weekBlogRes = await doWeekBlogs(task);
      if (weekBlogRes) {
        results.push(weekBlogRes);
      }
    }
  }
  if (!results.length) {
    console.log("=== 今日没有还未完成的任务 ===");
    return "今日没有还未完成的任务";
  }
  return results.join("\n");
};

// 写周报
const doWeekBlogs = async (taskInfo) => {
  console.log("=== 执行周报任务 ===");
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
  console.log("需要写周报的月份有 => ", blogDates);
  const blogTasks = [];
  for (let { year, month } of blogDates) {
    blogTasks.push(...(await getBlogTasks(year, month, traineeId)));
  }
  console.log("需要写的周报有 => ", blogTasks);
  const results = [];
  for (let blogTask of blogTasks) {
    const res = await submitBlog(traineeId, blogTask);
    console.log(`第${blogTask.week}周周报上交${res ? "成功" : "失败"}`);
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
  return data.filter((item) => item.status == 2);
};
const submitBlog = async (traineeId, blogTask) => {
  const blogType = 1;
  const blogs = reports[blogTask.week - 1];
  console.log("=== 保存周报 ===");
  const id = await $http.post(apis.weelBlogSave, {
    blogType,
    blogTitle: "实习周记",
    blogBody: blogs[Math.round(Math.random() * blogs.length)],
    blogOpenType: 2,
    traineeId: traineeId,
    isDraft: 0,
    startDate: blogTask.startDate,
    endDate: blogTask.endDate,
    backgroundTemplateId: 0,
    fileJson: "",
    blogId: "undefined",
  });
  console.log("=== 提交周报 ===");
  const { submitNum } = await $http.post(apis.weelBlogSubmit, {
    blogType,
    traineeId,
  });
  return submitNum > 0;
};

const xyb = async () => {
  await login();
  const tasks = await getTasks();
  const result = await doTasks(tasks);
  console.log(result);
  // await sendMsg(result);
};

xyb();
