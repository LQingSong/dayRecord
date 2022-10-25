# Robot Spider Base Knowledge

## App 抓包工具

- [Fiddler](https://mp.weixin.qq.com/s?__biz=Mzg2NzYyNjg2Nw==&mid=2247489894&idx=1&sn=d620c16bf3fcb4657c8c44152d936fc7&chksm=ceb9e37af9ce6a6c3017158256b06afd5fb1945a4cd05f9db7e27c31606626ee73d0cc44a074&scene=27#wechat_redirect)

## requests

## 正则 re

## 写 Python 有个隔离环境

[pythonEnv](../../imgs/pythonEnv.png)

## JSON

- 将 python 对象转化为 json：
  > json.dumps()
- 将 JSON 数据转化为 python 对象：
  > json.loads()

## 多进程、多线程、协程

### 多线程

- threading
- ThreadPoolExecutor 线程池
  避免重复创建和消耗线程

## 多进程

充分利用 CPU

> pool = multiprocessing.Pool(mutiprocessing.cpu_count())
> 根据电脑 CPU 的内核数量创建相应的进程池，进程池不需要大于内核数，多了反而没什么好处

## 伪装 Header

为 requestes 设置 header

```python
header1 = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
}
response = requests.get(url, headers=header1)
```

## 伪装 IP

为 requestes 设置代理 IP:

```py
proxie = {
    'http': 'http://xx.xxx.xxx.xxx:xxxx',
    'http': 'http://xx.xxx.xxx.xxx:xxxx'
    ...
}

response = requests.get(url, proxies = proxie)
```

### 搞一个免费 IP 代理池

    通过python脚本去抓取网上大量免费的代理ip，然后定时去检测这些ip可不可以用，下次你需要使用代理ip的时候，就需要去自己的ip代理池里面拿就行了。

## 爬要登录的网站

- Cookie
  登录一次，拿到 Cookie，为 requestes 设置 Cookie：

```py
headers = {
    'User-Agent': 'xxxx',
    'Cookie': 'xxxxx'
}
session = requests.Session()
response = requests.get(url, headers=headers)
```

## 模拟登录 Selenium

[开源项目](https://github.com/Kr1s77/awesome-python-login-model)

## Appium

环境搭建

- node
- JDK
- Android SDK
- 安装 Appium
  > npm install -g appium

## App 反编译 混淆和反混淆

### 夜神模拟器 adb 连接

adb connect 127.0.0.1:62001

### 反编译

对 Apk 进行反编译，获取程序源代码、图片、xml 等资源。

- MT
- Xposed + JustTrustMe 模块
  [参考文档](https://zhuanlan.zhihu.com/p/36538699)

Xposed 是一个框架，它可以改变系统和应用程序的行为，而不接触任何 APK。

它支持很多模块，每个模块可以用来帮助实现不同的功能。

JustTrustMe 是一个用来禁用、绕过 SSL 证书检查的基于 Xposed 模块。JustTrustMe 是将 APK 中所有用于校验 SSL 证书的 API 都进行了 Hook，从而绕过证书检查。

### TODO 明天实现 Fiddler 抓 Bilibili (再放一放，因为解析 App 对现阶段来说不是主要的)

## 买了本实战书，看目录感觉对于系统入门比较全面，作者还搭建了一个平台，书中例子能实践。

明天跟着书学应该会比较好。
