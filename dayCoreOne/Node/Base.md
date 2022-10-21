# Node 基础

参考文章：
https://www.liaoxuefeng.com/wiki/1022910821149312/1023025800783232

## 使用严格模式

- 1. 在每个 JavaScript 文件开头写上'use strict'
- 2. 给 Node 传递一个参数，让 Node 直接为所有 js 文件开启严格模式
     > node --use_strict xxx.js

## 模块 Module

模块的好处：

- 大大提高了代码的可维护性，不必将所有源码都写在一个文件(.js)里。
- 可复用，当一个模块写完，可在其它地方被引用
- 还可以避免函数名和变量名冲突

## CommonJS 规范

向外暴露模块的变量，输出的变量可以是任意对象、函数、数组等

> module.exports = variable;

引用模块，相对路径

> var foo = require(module) // relative path

遇到问题 Cannot find moudle 'xxx'，检查

- 模块名是否写对了
- 模块文件是否存在
- 相对路径是否写对了

Node.js **实现“模块”功能**的奥妙就在于 Javascript 是一种函数式编程语言，它支持闭包。用一个函数将代码包装起来，让原本代码的“全局”变量变成了函数内部的局部变量，这样就实现了“模块”。

## Node 运行环境

Node 是运行在服务端的 Javascript 环境，服务器程序和浏览器程序相比，最大的特点就是没有浏览器的安全限制。

## global

Javascript 有且仅有一个全局对象，在浏览器中，叫 window 对象。而在 Node 环境中，也是只有唯一全局对象，但不叫 window，叫 global。

## process

process 也是 Node 提供的一个对象，它代表当前 Node 进程，通过 process 对象可以拿到很多有用信息。

**Javascript 程序是由事件驱动执行的单线程模型**，Node.js 也不例外。Node.js 不断执行响应事件的 Javascript 函数，直到没有任何响应事件的函数可以执行时，Node.js 就退出了。

如果我们想要在下一次事件响应中执行代码，可以调用 process.nextTick();

```js
process.nectTick(function () {
  console.log("nextTick callback");
});

console.log("nextTick was set!");
```

输出结果：

> nextTick was set!
> nextTick callback

可以响应 exit 事件，就可以在程序即将退出时执行某个回调函数：

```js
process.on("exit", function (code) {
  console.log("about to exit with code:" + code);
});
```

## 判断 Javascript 执行环境

有很多代码技能在浏览器中执行，也能在 Node 环境执行，有时候需要程序自身判断自己到底在什么环境下执行的，常用的方法如下：

```js
if (typeof window === "undefined") {
  console.log("node.js");
} else {
  console.log("borwser");
}
```

## Node.js API

https://nodejs.org/dist/latest-v18.x/docs/api

## 文件系统模块 fs

Node.js 内置的 fs 模块就是文件系统模块，负责读写文件。

和其它所有的 Javascript 模块不同的是，fs 模块提供异步和同步的方法。

### 异步方法

因为 Javascript 的单线程模型，执行 IO 操作时，JavaScript 代码无需等待，而是传入回调函数后，继续执行后续 Javascript 代码。常见的异步如 ajax 请求

```js
fetch("http:xxx.com/query", (data) => {
  console.log("请求结果返回后执行...");
});
console.log("不必等待上述请求完成，直接执行后续代码...");
```

而同步（Sync）的 IO 操作需要等待函数返回：

```js
const data = getJSONSync("http://example.com/ajax");
```

同步操作的好处是代码简单，缺点是程序将等待 IO 操作，在等待时间内，无法响应其它任何事件。而异步读取不用等待 IO 操作，但代码较麻烦。

### 异步读文件

> **语法: fs.readFile(path[, options], callback)**

```js
"use strict";

var fs = require(fs);
fs.readFile("example.txt", "utf-8", function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
```

![文件路径](./../../imgs/node-fs-read.png)
由此可见文默认件路径为当前活动工作区。

异步读取时，callback 回调函数接收两个参数，err 和 data,正常读取时，err 为 null,data 为读取的内容。当读取错误时，err 为一个错误对象，data 为 undefined。

如果要使用相对路径的话，得配合 Node.js 的另外一个内置模块 path 使用。

```js
const fs = require("fs");

const path = require("path");

const read = (path, encodeing) => {
  fs.readFile(path, encodeing, (err, data) => {
    if (err) {
      console.log("读取错误----->:", err);
    } else {
      console.log("读取内容----->:", data);
    }
  });
};

read(path.join(__dirname, "../test/example.txt"), "utf-8");
```

普通字符串内容读取时，调用 data.toString() 或者传入编码格式“utf-8”
**如果不传入编码格式，回调函数 data 将返回一个 Buffer 对象**。在 Node.js 中，Buffer 对象就是一个包含零个或任意个字节的数组。（特别注意：和 Array 不同）

#### Buffer

Buffer 对象可以和 String 作转换：

```js
let text = data.toString("utf-8");
```

或者把一个 String 转换成 Buffer：

```js
let buf = Buffer.from(text, "utf-8");
```

### 同步读文件

> **语法： fs.readFileSync(path[, options])**

同步读取的函数和异步函数相比，多了一个 Sync 后缀，并且不接收回调函数直接返回结果。

如果同步读取文件发生错误,则需要用 try..catch 捕获错误：

```js
try {
  let data = fs.readFileSync("example.txt", "utf-8");
  console.log(data);
} catch (err) {
  console.log("出错了");
}
```

### 异步写文件

> **语法：fs.writeFile(file, data[, options], callback)**

writeFile() 的参数依次为文件名，数据和回调函数。如果传入的数据是 String，默认按 utf-8 编码写入文件，如果传入的参数是 Buffer,则写入的是二进制文件。回调函数只关心成功与否，所以只需要一个 err 参数。

```js
...其余省略
const file = path.join(__dirname, "../test/example.txt");
const write = (path, data) => {
  fs.writeFile(path, data, (err) => {
    if (err) {
      console.log("写入失败");
    } else {
      console.log("成功");
    }
  });
};

write(file, "你好啊，Node.js!");
```

注意：写入会覆盖源文件
fs.writeFileSync(file, data[, options])

### 同步写入文件

> 语法：fs.writeFileSync(file, data[, options])

```js
const writeSync = (path, data) => {
  fs.writeFileSync(path, data);
};

writeSync(file, "同步方法：你好啊，Node.js!");
```

同步方法失败的话会阻塞后续代码的执行

### Stat

如果我们要获取文件大小，创建时间等信息，可以使用 fs.stat(),它返回一个 stat 对象，能得到文件或目录的详细信息。

```js
const getFileInfo = (file) => {
  fs.stat(file, (err, stat) => {
    if (err) {
      console.log("获取失败----->", err);
    } else {
      console.log("isFile----->", stat.isFile);

      console.log("isDirectory----->", stat.isDirectory);

      if (stat.isFile) {
        console.log("size----->", stat.size);

        console.log("birth time----->", stat.birthtime);

        console.log("modified time----->", stat.mtime);
      }
    }
  });
};

getFileInfo(file);
```

由于 Node 环境执行的 Javascript 代码是服务器端代码，所以，绝大部分需要在服务器运行期反复执行业务逻辑的代码，必须使用异步代码，否则，同步代码在执行时期，服务器停止响应，因为 Javascript 只有一个执行线程。

服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，因为这些代码只在启动和结束时执行一次，不影响服务器正常运行时的异步执行。

## Stream 流

stream 是 Node.js 提供的又一个仅在服务端可用的模块，目的是支持“流”这种数据结构。

### 以件流读取文本内容：

创建文件流：fs.createReadStream

```js
const readStream = (file, encodeing) => {
  const rs = fs.createReadStream(file, encodeing);

  rs.on("data", (chunk) => {
    console.log("Data:", chunk);
  });

  rs.on("end", () => {
    console.log("end");
  });

  rs.on("error", (err) => {
    console.log("出错了", err);
  });
};

readStream(file, "utf-8");
```

> 注意： data 事件可能会有多次，每次传递的 chunk 是流的一部分。

### 以流的形式写入文件

要以流的形式写入文件，只需要不断调用 write 方法，最后以 end 结束：

```js
const writeByStream = (file, encodeing) => {
  const ws = fs.createWriteStream(file, encodeing);
  ws.write("使用Stream写入文本数据...\n");
  ws.write("END.");
  ws.end();
};

writeByStream(file, "utf-8");
```

Buffer 形式：
new Buffer() 已被废弃，最新语法是 Buffer.from(string)

```js
const writeBufferStream = (file, encodeing) => {
  const ws = fs.createWriteStream(file, encodeing);
  ws.write(Buffer.from("使用Buffer Stream 写入数据...\n"));
  ws.write(Buffer.from("END"));
  ws.end();
};
```

**所有可以读取数据的流都继承自 stream.Readable, 所有可以写入的流都继承自 stream.Writeable。**

### pipe 管

就像可用把两个水管串成一个更长的水管一样，两个流也可以串起来。一个 Readable 流和一个 Writeable 流串起来后，所有的数据自动从 Readable 流进入 Writeable 流，这种操作叫做 pipe。

在 Node.js 中，Readable 流有一个 pipe()方法。
复制文件的功能：

```js
const copyFile = (originFile, targetFile) => {
  const rs = fs.createReadStream(originFile);
  const ws = fs.createWriteStream(targetFile);

  rs.pipe(ws);
};

const originFile = path.join(__dirname, "../test/originFile.txt");

copyFile(originFile, file);
```

默认情况下，当 Readable 流的数据读取完毕，end 事件触发后，将自动关闭 Writeable 流。如果我们不希望自动关闭 Writeable 流，需要手动传入参数：

> readable.pipr(writeable, { end: false })

流的操作都是异步的，如果有需要获取 pipe 完成后的回调，可以调用：

> rs.on('end', ())

## http

要开发 HTTP 服务程序，从头处理 TCP 连接，解析 HTTP 是不现实的。这些工作实际上已经由 Node.js 自带的 http 模块完成了。应用程序并不直接和 HTTP 协议打交道，而是操作 http 模块提供的 request 和 response 对象。

- request 对象封装了 HTTP 请求，我们调用 request 对象的属性和方法就可以拿到所有 HTTP 请求的信息
- response 对象封装了 HTTP 响应，我们操作 response 对象的方法，就可以把 HTTP 响应返回给浏览器。

### 基础 web Http 服务器：

```js
const httpServer = () => {
  const http = require("http");

  const server = http.createServer((request, response) => {
    console.log(`${request.method}: ${request.url}`);
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end("<h1>Hello world!</h1>");
  });
  server.listen(8080);
  console.log("Server is running at http://127.0.0.1:8080/");
};

httpServer();
```

### 文件服务器

```js
const fileServer = () => {
  let root = path.resolve(process.argv[2] || ".");
  console.log("process---->", process);
  console.log("Static root dir---->", root);

  const server = http.createServer((request, response) => {
    const pathName = url.parse(request.url).pathname;
    const filepath = path.join(root, pathName);
    fs.stat(filepath, (err, stats) => {
      if (!err && stats.isFile()) {
        console.log("200 ---->", request.url);

        response.setHeader("content-type", "text/plain; charset=utf-8");
        response.writeHead(200);
        fs.createReadStream(filepath).pipe(response);
      } else {
        console.log("404", request.url);
        response.writeHead(404);
        response.end("404 Not Found");
      }
    });
  });

  server.listen(8080);

  console.log("Server is running at http://localhost:8080/");
};
```

## crypto 模块

crypto 模块的目的是为了提供通用的加密和哈希算法。Node.js 用 c/c++实现这些算法后，通过 crypto 模块暴露为 JavaScript 接口，这样用起来方便，运行速度也快。

### MD5 和 SHA1

MD5 是一种常用的哈希算法，用于给任意数据一个“签名”。这个签名通常用一个十六进制的字符串表示：

```js
const md5 = (data) => {
  const hash = crypto.createHash("md5");
  hash.update(data);
  console.log(hash.digest("hex"));
};

md5("Hello, World");
```

如果要计算 SHA1，只需要把“md5”换成“sha1”，就可以得到 SHA1 的几个。
还可以使用更安全的 sha256 和 sha512。

### Hmac

hamc 算法也是一种 hash 算法，它可以利用 MD5 或 SHA1 等哈希算法。不同的是，Hmac 还需要一个密钥。

```js
const hmac = (data, secret = "secret-key") => {
  const hash = crypto.createHmac("sha256", secret);
  hash.update(data);
  console.log(hash.digest("hex"));
};
```

只要密钥发生了变化，同样的 data 数据也会得到不同的签名，因此，可以把 Hmac 理解为用随机数“增强”的哈希算法。

### AES

AES 是一种常用的对称加密算法，加解密都用同一个密钥。crypto 模块提供了 AES 支持，但需要自己封装好函数：

```js
const aes = (data) => {
  const encrypt = (key, iv) => {
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    return cipher.update(data, "utf-8", "hex") + cipher.final("hex");
  };

  const decrypt = (encrypted, key, iv) => {
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    return decipher.update(encrypted, "hex", "utf-8") + decipher.final("utf-8");
  };

  console.log("data---->", data);
  const key = crypto.randomBytes(16);
  const iv = Buffer.alloc(16, 0);
  const encrypted = encrypt(key, iv);
  console.log("encrypt ---->", encrypted);
  const decrypted = decrypt(encrypted, key, iv);
  console.log("decrypted ---->", decrypted);
};

aes("Hello World!");
```

注：crypto.createCipher() 和 crypto.createDecipher 过时了，改用 crypto.createCipheriv() 和 crypto.createDecipheriv()

AES 不同加密算法的参数有所区别([其余的看文档](https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#cryptocreatecipherivalgorithm-key-iv-options))：
cbc 模式配置：
|algorithm|key|iv|
|----|----|----|----|
|aes-128-cbc| 16| 16
|aes-192-cbc |24 |16
|aes-256-cbc |32 |16

- ccm 模式还必须指定 authTagLength 参数

特别注意：在应用中，如果加解密双方一方用 Node.js，另一方用 Java、PHP 等其它语言，需要仔细测试。如果无法正确解密，需要双方确认是否遵循同样的 AES 算法，字符串密钥 Key 和 iv 是否相同，加密后的数据是否统一为 hex 或 base64 格式。

### Diffie-Hellman

DH 算法是一种密钥交换协议，它可以让双方在不泄露密钥的情况下协商出一个密钥来。
**DH 主要就是用于在不安全的网络环境下建立起通信双方的密钥,从而使通信双方能够使用这个密钥进行后续通信消息的加密解密，实现通信安全。**

DH 算法基于数学原理，比如小明和小红想要协商一个密钥，可以这么做：

1. 小明先选一个素数和一个底数，例如，素数 p=23,底数 g=5,再选择一个秘密整数 a=6, 计算 A = g^a mod p = 8,然后大声告诉小红： p=23, g=5, A=8;
2. 小红收到小明发来的 p, g, A 后，也选择一个秘密整数 b=15,然后计算 B = g^b mod p = 19, 并大声告诉小明：B=19;
3. 小明自己计算出 s= B^a mod p = 2, 小红也自己计算出 s = A^b mod p = 2, 因此, 最终协商的密钥 s = 2。

在这个过程中，密钥 2 并不是小明告诉小红的，也不是小红告诉小明的，而是双方协商计算出来的。第三方只能知到 p=23, g=5, A=8, B=19,由于不知道双方选的秘密整数 a=6 和 b=15，因此无法计算出密钥 2。

```js
const DH = () => {
  const ming = crypto.createDiffieHellman(512);
  const ming_keys = ming.generateKeys();

  const prime = ming.getPrime();
  const generator = ming.getGenerator();

  const hong = crypto.createDiffieHellman(prime, generator);
  const hong_keys = hong.generateKeys();

  const ming_secret = ming.computeSecret(hong_keys);
  const hong_secret = hong.computeSecret(ming_keys);

  console.log("Secret of Xiao Ming:", ming_secret.toString("hex"));
  console.log("Secret of Xiao Hong:", hong_secret.toString("hex"));
};
```

注意每次输出都不一样，因为素数的选择是随机的。

### RSA

RSA 算法是一种非对称加密算法，即由一个私钥和一个公钥构成的密钥对，通过私钥加密，公钥解密，或者通过公钥加密，私钥解密。其中，公钥公开，私钥必须保密。

相比对称加密，非对称加密只需要每个人各自持有自己的私钥，同时公开自己的公钥。

#### 准备私钥和公钥

- 在命令行执行以下命令以生成一个 RSA 密钥对：
  > openssl genrsa -aes256 -out rsa-key.pem 2048

根据提示输入密码，这个密码是用来加密 RSA 密钥的，加密方式指定为 AES256，生成的 RSA 的密钥长度是 2048 位。执行成功后，我们获得了加密的 rsa-key.pem 文件。

- 通过上面的 rsa-key.pem 加密文件，我们可以导出原始的私钥，命令如下：
  > openssl rsa -in rsa-key.pem -outform PEM -out rsa-prv.pem

输入第一步的密码，我们获得了解密后的私钥。

- 类似的，我们用下面的命令导出原始的公钥：
  > openssl rsa -in rsa-key.pem -outform PEM -pubout -out rsa-pub.pem

这样，我们就准备好了原始私钥文件 rsa-prv.pem 和原始公钥文件 rsa-pub.pem，编码格式均为 PEM。

```js
const rsa = (msg) => {
  const loadKey = (file) => {
    return fs.readFileSync(file, "utf-8");
  };

  const prvKey = loadKey("./rsa-prv.pem"),
    pubKey = loadKey("./rsa-pub.pem");

  let enc_by_prv = crypto.privateEncrypt(prvKey, Buffer.from(msg, "utf-8"));
  console.log("加密后的msg ---->", enc_by_prv.toString("hex"));

  let dec_by_pub = crypto.publicDecrypt(pubKey, enc_by_prv);
  console.log("解密后的msg ---->", dec_by_pub.toString("utf-8"));
};
```

注意：如果我们把 message 字符串的长度增加到很长，例如 1M，这时，执行 RSA 加密会得到一个类似这样的错误： data too large for key size,这是因为 RSA 加密的原始信息必须小于 key 的长度。

那如何用 RSA 加密一个很长的消息呢？
实际上，RSA 并不适合加密大数据，而是先生成一个随机的 AES 密码，用 AES 加密原始信息，然后用 RSA 加密 AES 口令。这样，实际使用 RSA 时，给对方传的密文分两部分，一部分时 AES 加密的密文，另一部分时 RSA 加密的 AES 口令。
对方想用 RSA 解密出 AES 口令，再用 AES 解密密文，即可获得明文。

## Web 服务器开发

### Express

Express 是第一代最流行的 web 框架，它对 Node.js 的 http 进行了封装，用起来如下：

首先安装 express

> yarn
> yarn add express

```js
const expressServer = () => {
  const express = require("express");

  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(3000, () => {
    console.log("Express app listenning on port 3000!");
  });
};
```

虽然 Express 的 API 很简单，但是它是基于 ES5 的语法，要实现异步代码，只有一个方法：回调。如果异步嵌套层次过多，代码写起来就会造成“异步回调地狱”：

```js
app.get("/test", (req, res) => {
  fs.readFile("/file1", (err, data) => {
    if (err) {
      res.status(500).send("read file1 error");
    }
    fs.readFile("/file2", (err, data) => {
      if (err) {
        res.status(5000).send("read file2 error");
      }
      res.type("text/plain");
      res.send(data);
    });
  });
});
```

虽然可以用 async 这样的库来组织异步代码，但是用回调写异步实在是太痛苦。

### Koa

随着 Node.js 开始支持 ES6，express 团队由基于 es6 的 generator 重新编写了下一代 web 框架 koa。

```js
const koaApp = () => {
  const koa = require("koa");
  const app = koa();

  app.use("/test", function* () {
    yield doReadFile1();
    const data = yield doReadFile2();
    this.body = data;
  });

  app.listen(3000);
};
```

用 generator 实现异步回调简单了不少，但是 generator 的本意并不是异步。Promise 才是为异步设计的，但是 Promise 的写法相对复杂一点。ES7 引入了新的关键字 aysnc 和 await，可以轻松地把一个 function 变为异步模式：

```js
async function() {
  const data = await fs.readFile('./file');
}

```

### koa2

[官网](https://koa.bootcss.com/)

koa 团队并没有止步于 koa1.0，他们基于 ES7 开发了 koa2，和 koa1 相比，koa2 完全使用 Promise 并配合 async 来实现异步：

#### Koa 基础使用

app.use(fn) 添加中间件方法。app.use()返回 this,因此可以链式使用。

```js

```

### 工程模块化 Koa 处理 URL

## 实现一个前后端响应的 Web 服务器，存储前端传过来的数据，保存为 file.js

- 1. 搭建 Web 服务，完成 post 请求
     完成
- 2. 获取前端请求数据
     完成
- 3. 保存为 js 文件
  - 完成了保存到指定文件内
  - JSON 对象的读取通过 JSON.stringify() 和 JSON.prase()

完成！！！

### Koa、Fetcth、 CROS 总结

- Koa 解析参数

1. params 路径参数，通过 koa 自带的就可以完成

```js
ctx.body = {
  url: ctx.url,
  query: ctx.query,
  queryString: ctx.querystring,
};
```

2. post 请求的 body，用 koa 自带的还需要解析一大堆麻烦事，可以使用 koa-bodyparser 中间件：

```js
const bodyparser = require('koa-bodyparser');

app.use(bodyparser());
...
ctx.body = ctx.request.body
```

- CROS 跨域问题

1. 服务端设置：

```js
// 允许哪些访问源可以跨域 url: * | http(s)://ip:port
ctx.set("Access-Control-Allow-Origin", "*");
// 设置哪些方法可以跨域
ctx.set("Access-Control-Allow-Methods", "GET, POST");
// 允许请求设置的Header，如果客户端请求不设置正确的Content-Type，服务器端会无法解析正确的请求参数
ctx.set("Access-Control-Allow-Headers", "Content-Type");
// 预检请求 有效期 单位s
ctx.set("Access-Control-Max-Age", 3600);
// 支持 cookies等身份凭证，设置这个必须设置 Access-Control-Allow-Origin 固定访问源，不可用*
ctx.set("Access-Control-Allow-Credentials", "true");
```

2. fetch 客户端：

```js
fetch(url, {
  // 设置headers
  headers: {
    "Content-Type": "application/json", // 设置请求内容的格式
  },
  // 是否允许携带cookie
  credentials: "include",
  // 允许跨域
  mode: "cors",
});
```
