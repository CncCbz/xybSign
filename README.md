# 校友邦自动签到

可以配合腾讯云函数使用，免去校友邦每日签到的麻烦

### 运行环境

python3

### 运行方式

配置`user.json`内容，运行`autoSign.py`


> 运行出错或无法实际签到请尝试使用`copy.py`版本


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
  "reason": "",  //签到备注
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

### 腾讯云函数部署python脚本

>腾讯云函数可以实现脚本自动运行，配合qmsg酱或server酱实现打卡通知

前提：进入[腾讯云账号注册页面](https://cloud.tencent.com/register)注册账号，开通云函数服务

1. 登录 [云函数控制台](https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fscf)，点击左侧导航栏`函数服务`，在函数服务页面上方选择地域，单击`新建`，如下图所示：
![1.jpg](https://ae01.alicdn.com/kf/U067134e2785948f5b05ccdb8bd582c16S.jpg)
2. 选择`自定义创建`，运行环境选择`Python3.6`，修改函数名称，如下图：
![2.jpg](https://ae01.alicdn.com/kf/U873a0be7a91442d5aff2948544605bfet.jpg)
3. 在`函数代码`处选择在线编辑，新建`user.json`文件，根据[user.json](https://github.com/CncCbz/xybSign/blob/main/user.json)文件进行内容填写，并将[autoSign.py](https://github.com/CncCbz/xybSign/blob/main/autoSign.py)中的所有代码复制到云函数`index.py`中，如下图
>记得`CTRL+S`保存函数
![3.jpg](https://ae01.alicdn.com/kf/Uf8da1b423b004fb29a9de531ad0096a0M.jpg)
![4.jpg](https://ae01.alicdn.com/kf/Ufd4ecc4576be4542814cbbd492a10796v.jpg)
4. 配置`触发器`，选择自定义创建，配置`corn`
> 图中表示每日9AM触发签到函数，详细配置策略请参考[corn相关文档](https://cloud.tencent.com/document/product/583/9708#cron-.E8.A1.A8.E8.BE.BE.E5.BC.8F)
![5.jpg](https://ae01.alicdn.com/kf/U35a7a71247e04fdf8da58c794f854a40N.jpg)
5. 点击完成，等待函数创建完成，选择刚刚创建的函数，点击测试，查看测试结果，若测试成功，则表示云函数部署完成
![6.jpg](https://ae01.alicdn.com/kf/U5a8052c902dd4cc2b08b2b50d70270cfT.jpg)
![7.jpg](https://ae01.alicdn.com/kf/Ubc0fd3f3036e430b9fe73f91e5df42a9S.jpg)

> 若需要qq机器人或wx推送签到结果，可使用[Qmsg酱](https://qmsg.zendee.cn/)或[Server酱](http://sc.ftqq.com/3.versionServer)。前往他们的官网获取`KEY`后填入`user.json`即可

代码参考[java 项目](https://github.com/xiaomingxingwu/xyb-sign)
