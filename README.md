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

### 校友邦微信小程序`openid`获取

> 签到默认提交的地址是在申请实习时的地址，如果需要修改请自行修改`getPosition()`中的`lat`、`lng`参数

工具：`Fiddler`、`PC端wx`

前提："校友邦"微信小程序绑定校友邦账号

#### 抓包：
1. 登录PC端wx
2. 开启Fiddler抓包（fiddler安装方法请自行百度）
3. 打开校友邦微信小程序，这时就能看到fiddler抓包结果，如下图
![1.jpg](https://ae01.alicdn.com/kf/Ufb84babb909d447484df52a818947cf5W.jpg)
4. 点击左下角停止抓包，`CTRL + F` 搜索 `openid`，如下图
![2.jpg](https://ae01.alicdn.com/kf/U8fdb98f2d0134411892b5af943a43b00t.jpg)
左侧黄色即为包含`openid`的数据包，选择其中一个双击 
5. 右侧即为需要的`openid`和`unionId`
![3.jpg](https://ae01.alicdn.com/kf/U49ecae26904a4ded81d4ad18c683e32dR.jpg)


代码参考[java 项目](https://github.com/xiaomingxingwu/xyb-sign)
