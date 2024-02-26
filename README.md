`本代码仅供参考和学习,请勿用于任何商业用途,所造成的一切法律后果自负,与本代码无关!`

# xybSign
校友邦 多用户 自动签到(上传图片)、填写周报

### 字太多了，不想看？
just open it -> [异地打卡](https://xybfreesign.netlify.app/)

### 方法一、本地运行
- 下载代码(解压)
- 修改`config.js`中的配置,正确填写用户名、密码
  默认配置了一些周报模板,要修改的话,修改config.js中的reports
  reports的index对应的就是当周周报的多个模板,在提交周报时会随机选取其中一个
- 在终端中进入代码目录,执行`npm install`
- 终端中输入`node index.js`运行index.js

### 方法二、利用github action自动签到（不推荐！！）
`github服务器的IP存在被检测的风险，风险自担！！`

发现下载代码运行的方式对于大部分人来说还是有难度，下面介绍一下如何借助github平台部署`自动化签到`
- 写在前面
	 如果你想使用自动签到，强烈建议你注册一个[qmsg酱](https://qmsg.zendee.cn/login)账号用于发送签到通知，避免出现程序故障导致的漏签等情况！[如何使用？](https://qmsg.zendee.cn/docs/start/#%E7%A7%81%E8%81%8A%E6%B6%88%E6%81%AF%E6%8E%A8%E9%80%81%E4%BD%BF%E7%94%A8%E6%AD%A5%E9%AA%A4%E7%AE%80%E8%BF%B0)
- 注册[github](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home)账号
- [fork](https://github.com/CncCbz/xybSign/fork)本项目

        `如果觉得本项目对你有帮助，还可以点个star`
	![image](https://github.com/CncCbz/xybSign/assets/43227065/a6332789-eb48-4a09-bc05-fa23f2e82eca)
	
	![image](https://github.com/CncCbz/xybSign/assets/43227065/5a9b8341-8730-4e04-9a78-9ef95a355dce)

- 配置打卡周期（可选，默认为每天9AM执行）

	修改文件`.github/workflows/main.yml`文件中的'cron'，如果你不知道怎么写，可以前往 [core生成](core生成)

- 配置Actions secrets
  
	 `页面路径 Setting -> Secrets and variables -> Repository secrets`
	  ![image](https://github.com/CncCbz/xybSign/assets/43227065/f515174f-4793-446b-bb5a-a76ce43a05f4)

- 添加 secrets

	 ![image](https://github.com/CncCbz/xybSign/assets/43227065/a156b3e2-4ccc-444f-bf84-28097a7559ff)

	 secrets规则:
	 1、每个配置之间以`;`分割
	 2、配置项以`key=value`的形式填写
	 3、账号配置项支持多个，以`&`分割
	 举例如下：
	 - 单个账号 `username=用户名&password=密码`
	 - 多个账号`username=用户名&password=密码;username=用户名&password=密码`
	 - 签到`mode=in` 签退`mode=out`
	 - qmsg秘钥  `qmsgKey=秘钥`   推送qq号 `qmsgTo=qq1,qq2`
	 完整示例：
	 - 单个账号执行 签到、重新签到、填写周报并且通过qmsg发送签到结果给QQ号123412445： `username=用户名&password=密码&reSign=true&needReport=true;mode=in;qmsgKey=keykey;qmsgTo=123412445`

- 验证功能

	 进入Action页面 -> 点击`签到`workflow -> 运行 -> 进入运行记录
	![image](https://github.com/CncCbz/xybSign/assets/43227065/f105ebe5-a26f-4871-b82f-21ac77a62c85)

	查看运行结果，如果成功签到，恭喜你，你已经实现了定时签到功能！
	 ![image](https://github.com/CncCbz/xybSign/assets/43227065/141c63c4-57d3-4ce9-9b71-eeefd88e4a12)

