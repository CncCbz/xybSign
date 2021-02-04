# 校友邦自动签到

可以配合腾讯云函数使用，免去校友邦每日签到的麻烦

### 运行环境

python3

### 运行方式

配置`user.json`内容，运行`autoSign.py`
user.json

```javascript
{
  "token":{
    "openId":"",  //当前小程序唯一标识
    "unionId":""  //当前小程序汇总标识
  },
  "location":{
    "country":"中国",  //国家
    "province":"", //省份
    "city":"",  //城市
    "adcode":"",  //行政区代码
    "address":""  //签到地址
  },
  "reason": ""  //签到备注
  "Qmsg":"",  //Qsmg酱的SCKEY
  "ServerChan":""  //Server酱的SCKEY
}
```

代码参考[java 项目](https://github.com/xiaomingxingwu/xyb-sign)
