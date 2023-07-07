const md5 = require("blueimp-md5");
const Q = new RegExp(
    "[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]"
  ),
  W = (e) => {
    let t = [
        "`",
        "~",
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "+",
        "=",
        "|",
        "{",
        "}",
        "'",
        ":",
        ";",
        "'",
        ",",
        "[",
        "]",
        ".",
        "<",
        ">",
        "/",
        "?",
        "~",
        "！",
        "@",
        "#",
        "￥",
        "%",
        "…",
        "…",
        "&",
        "*",
        "（",
        "）",
        "—",
        "—",
        "+",
        "|",
        "{",
        "}",
        "【",
        "】",
        "‘",
        "；",
        "：",
        "”",
        "“",
        "’",
        "。",
        "，",
        "、",
        "？",
        '"',
      ],
      n = [
        "content",
        "deviceName",
        "keyWord",
        "blogBody",
        "blogTitle",
        "getType",
        "responsibilities",
        "street",
        "text",
        "reason",
        "searchvalue",
        "key",
        "answers",
        "leaveReason",
        "personRemark",
        "selfAppraisal",
        "imgUrl",
        "wxname",
        "deviceId",
        "avatarTempPath",
        "file",
        "file",
        "model",
        "brand",
        "system",
        "deviceId",
        "platform",
        "code",
        "openId",
        "unionid",
      ];
    for (var a in e) {
      //!(过滤的字段 ||  特殊字符）不添加到字符串中
      let o = e[a] + "";
      o &&
        o.split("").some((e, o) => {
          if (t.indexOf(e) > -1) return -1 == n.indexOf(a) && n.push(a), !0;
        });
    }
    return n;
  },
  V = () => {
    let e = [
      "front/enterprise/loadEnterprise.action",
      "front/post/EnterprisePostLoad.action",
      "helpcenter/video/VideoPlayAuth.action",
      "login/teacher/sendMobileOrEmailCode.action",
      "login/student/sendMobileCode.action",
    ];
    return e;
  },
  z = (e) => {
    if (void 0 == e) return {};
    for (var t = Object.keys(e).sort(), n = {}, a = 0; a < t.length; a++)
      n[t[a]] = e[t[a]];
    return n;
  },
  F = (e, t) => {
    var n,
      a,
      o = e.slice(0),
      i = e.length,
      r = i - t;
    while (i-- > r)
      (a = Math.floor((i + 1) * Math.random())),
        (n = o[a]),
        (o[a] = o[i]),
        (o[i] = n);
    return o.slice(r);
  },
  H = (e, t) => {
    let n = [
        "5",
        "b",
        "f",
        "A",
        "J",
        "Q",
        "g",
        "a",
        "l",
        "p",
        "s",
        "q",
        "H",
        "4",
        "L",
        "Q",
        "g",
        "1",
        "6",
        "Q",
        "Z",
        "v",
        "w",
        "b",
        "c",
        "e",
        "2",
        "2",
        "m",
        "l",
        "E",
        "g",
        "G",
        "H",
        "I",
        "r",
        "o",
        "s",
        "d",
        "5",
        "7",
        "x",
        "t",
        "J",
        "S",
        "T",
        "F",
        "v",
        "w",
        "4",
        "8",
        "9",
        "0",
        "K",
        "E",
        "3",
        "4",
        "0",
        "m",
        "r",
        "i",
        "n",
      ],
      a = [];
    for (let u = 0; u < 62; u++) a.push(u + "");
    let o = Math.round(new Date().getTime() / 1e3),
      i = F(a, 20),
      r = "";
    i.forEach((e, t) => {
      r += n[e];
    });
    let s = z(e);
    var c = "";
    //!(过滤的字段 ||  特殊字符）不添加到字符串中  过滤 &nbsp;
    for (var l in s)
      -1 != W(e).indexOf(l) ||
        Q.test(s[l]) ||
        (null != s[l] && "" !== s[l] && '""' !== s[l] && (c += s[l]));
    return (
      (c += o),
      (c += r),
      (c = c.replace(/\s+/g, "")),
      (c = c.replace(/\n+/g, "")),
      (c = c.replace(/\r+/g, "")),
      (c = c.replace(/</g, "")),
      (c = c.replace(/>/g, "")),
      (c = c.replace(/&/g, "")),
      (c = c.replace(/-/g, "")),
      (c = c.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")),
      (c = encodeURIComponent(c)),
      (c = md5(c)),
      {
        md5: c,
        tstr: o,
        iArrStr: i && i.length > 0 ? i.join("_") : "",
      }
    );
  },
  Y = (e, t) => {
    if (!e) return;
    let n = [
        "5",
        "b",
        "f",
        "A",
        "J",
        "Q",
        "g",
        "a",
        "l",
        "p",
        "s",
        "q",
        "H",
        "4",
        "L",
        "Q",
        "g",
        "1",
        "6",
        "Q",
        "Z",
        "v",
        "w",
        "b",
        "c",
        "e",
        "2",
        "2",
        "m",
        "l",
        "E",
        "g",
        "G",
        "H",
        "I",
        "r",
        "o",
        "s",
        "d",
        "5",
        "7",
        "x",
        "t",
        "J",
        "S",
        "T",
        "F",
        "v",
        "w",
        "4",
        "8",
        "9",
        "0",
        "K",
        "E",
        "3",
        "4",
        "0",
        "m",
        "r",
        "i",
        "n",
      ],
      a = e.t,
      o = e.s.split("_"),
      i = "";
    o.forEach((e, t) => {
      i += n[e];
    });
    var r = "";
    return (
      (r += a),
      (r += i),
      (r = r.replace(/\s+/g, "")),
      (r = r.replace(/\n+/g, "")),
      (r = r.replace(/\r+/g, "")),
      (r = r.replace(/</g, "")),
      (r = r.replace(/>/g, "")),
      (r = r.replace(/&/g, "")),
      (r = r.replace(/-/g, "")),
      (r = r.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")),
      (r = encodeURIComponent(r)),
      (r = md5(r)),
      r == e.m
    );
  };
const t = {
  Z: {
    set(e, t, n) {
      const a = new Date();
      a.setDate(a.getDate() + n),
        (document.cookie = e + "=" + t + ";expires=" + a);
    },
    get(e) {
      let t = document.cookie.replace(/\s/g, "").split(";");
      for (let n = 0; n < t.length; n++) {
        let a = t[n].split("=");
        if (a[0] === e) return decodeURIComponent(a[1]);
      }
      return "";
    },
    remove(e) {
      this.set(e, "1", -1);
    },
    getAll() {
      let e = document.cookie.split(";"),
        t = {};
      for (let n = 0; n < e.length; n++) {
        let a = e[n].split("");
        t[a[0]] = unescape(a[1]);
      }
      return t;
    },
    clear() {
      let e = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (e)
        for (let t = e.length; t--; )
          document.cookie = e[t] + "=0;expires=" + new Date(0).toUTCString();
    },
  },
};
const Z = {
  getTokenData: H,
  checkToken: Y,
  nocheckArrs: W,
  checkUrl: V,
};

const getHeaders = function (url, data) {
  let headers = {
    Host: "xcx.xybsyw.com",
    Connection: "keep-alive",
    "User-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30515",
    // referer: "https://servicewechat.com/wx9f1c2e0bbc10673c/317/page-frame.html",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-cn",
    "content-type": "application/x-www-form-urlencoded",
    // xweb_xhr: 1,
  };
  let n = Z.nocheckArrs(data).join(","),
    a = Z.getTokenData(data, url);
  Z.checkUrl();
  (headers.n = n),
    (headers.m = a.md5),
    (headers.t = a.tstr),
    (headers.s = a.iArrStr);
  return headers;
};

module.exports = { getHeaders };
