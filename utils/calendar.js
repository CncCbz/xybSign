const md5 = require("blueimp-md5");
const { default: axios } = require("axios");
const { currentDate, DateLevel } = require("./dateTool.js")

const calendar = async (username, password) => {
  const sessionId = await fetchUser(username, password)
  const traineeId = await fetchDefaultClock(sessionId)
  const records = await fetchClockRecords(sessionId, traineeId, currentDate('-', DateLevel.MONTH))
  const { clockHistoryList, clockMonthCount, clockTotalCount } = records.data
  const matrix = parseCalendar(clockHistoryList, currentDate('-', DateLevel.MONTH));
  return [matrix, clockMonthCount, clockTotalCount]
}

const parseCalendar = (calendarModel, monthKey) => {
  const [nowYear, nowMonth] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(nowYear, nowMonth, 0).getDate()

  const dateSet = new Set(calendarModel.map(item => new Date(item.clockDate).getDate()));

  const row = Array.from({ length: daysInMonth }, (_, i) =>
    dateSet.has(i + 1) ? '■' : '□'
  )

  return row
    .reduce((rows, dayView, index) => {
      const weekIndex = Math.floor(index / 7)
      rows[weekIndex] = (rows[weekIndex] || '') + dayView + ' '

      return rows
    }, [])
    .map(week => week.trim())
    .join('\n')
}

const fetchClockRecords = async (sessionId, traineeId, monthKey) => {
  const records = await axios.request({
    url: "https://xcx.xybsyw.com/student/clock/PunchIn!historyList.action",
    headers: {
      Cookie: `JSESSIONID=${sessionId}`
    },
    params: {
      traineeId,
      months: monthKey
    }
  }).then((response) => response.data)
    .catch((error) => {
      console.error(error)
    })
  return records
}

const fetchDefaultClock = async (sessionId) => {
  const defaultClock = await axios.request({
    url: "https://xcx.xybsyw.com/student/clock/GetPlan!getDefault.action",
    headers: {
      Cookie: `JSESSIONID=${sessionId}`
    }
  }).then((response) => response.data)
    .catch((error) => {
      console.error(error)
    })
  return defaultClock.data.clockVo.traineeId
}

const fetchUser = async (username, password) => {
  const defaultClock = await axios.request({
    url: "https://xcx.xybsyw.com/login/login.action",
    params: {
      username,
      password
    }
  }).then((response) => response.data)
    .catch((error) => {
      cosnole.error(error)
    })
  return defaultClock.data.sessionId
}

module.exports = { calendar }
