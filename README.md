# 校友邦自动签到

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
}
```
