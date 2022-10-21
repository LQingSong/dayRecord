const fs = require("fs");

const path = require("path");

const http = require("http");

const url = require("url");

const crypto = require("crypto");

const read = (path, encodeing) => {
  fs.readFile(path, encodeing, (err, data) => {
    if (err) {
      console.log("读取错误----->:", err);
    } else {
      console.log("读取内容----->:", data.toString());
    }
  });
};

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

const writeSync = (path, data) => {
  fs.writeFileSync(path, data);
};

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

// getFileInfo(file);

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

// readStream(file, "utf-8");

const writeByStream = (file, encodeing) => {
  const ws = fs.createWriteStream(file, encodeing);
  ws.write("使用Stream写入文本数据...\n");
  ws.write("END.");
  ws.end();
};

// writeByStream(file, "utf-8");
const writeBufferStream = (file, encodeing) => {
  const ws = fs.createWriteStream(file, encodeing);
  ws.write(Buffer.from("使用Buffer Stream 写入数据...\n"));
  ws.write(Buffer.from("END"));
  ws.end();
};

// writeBufferStream(file, "utf-8");

const copyFile = (originFile, targetFile) => {
  const rs = fs.createReadStream(originFile);
  const ws = fs.createWriteStream(targetFile);

  rs.pipe(ws);
  rs.on("end", () => {
    getFileInfo(targetFile);
  });
};

const originFile = path.join(__dirname, "../test/originFile.txt");

// copyFile(originFile, file);

const httpServer = () => {
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

// httpServer();

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

// fileServer();

const md5 = (data) => {
  const hash = crypto.createHash("md5");
  hash.update(data);
  console.log(hash.digest("hex"));
};

// md5("Hello, World");

const hmac = (data, secret = "secret-key") => {
  const hash = crypto.createHmac("sha256", secret);
  hash.update(data);
  console.log(hash.digest("hex"));
};

// hmac("Hello, World", "123");

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

// aes("Hello World!");

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

// DH();

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

// expressServer();

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

const koa2App = () => {
  const koa = require("koa");
  const app = new koa();

  // logger
  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get("X-Response-Time");
    console.log(`${ctx.method} ${ctx.url}-${rt}`);
  });

  // x-response-time
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
  });

  // 对于任何请求
  app.use(async (ctx) => {
    ctx.body = "Hello Koa2!";
  });

  app.listen(3000);
  console.log("app started at port 3000");
};

// koa2App();

const writeDataToFile = (data, filePath) => {
  const ws = fs.createWriteStream(filePath, "utf-8");
  ws.write(data);
  ws.end();
  ws.on("finish", () => {
    console.log("数据保存成功");
  });

  ws.on("error", (err) => {
    console.log("出错了", err);
  });
};

const testKOA = () => {
  const koa = require("koa");
  const bodyParser = require("koa-bodyparser");

  const app = new koa();

  // 使用中间件
  app.use(bodyParser());

  app.use(async (ctx) => {
    // response headers
    // 服务端设置跨域设置
    ctx.set("Access-Control-Allow-Methods", "GET, POST");
    if (ctx.url === "/") {
      ctx.set("Access-Control-Allow-Origin", "*");
      console.log("get");
      ctx.body = "Hello world";
    } else if (ctx.url === "/get?id=1") {
      ctx.body = {
        url: ctx.url,
        query: ctx.query,
        queryString: ctx.querystring,
      };
    } else if (ctx.url === "/save") {
      // 如果需要支持 cookies,Access-Control-Allow-Credentials 需要设置为 true，并且 Access-Control-Allow-Origin 就不能设置为 *,
      // 注意第二个参数的写法，不要写成http://127.0.0.1:5500/; 客户端请求需要设置（fetch）credentials
      ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
      ctx.set("Access-Control-Allow-Credentials", "true");
      // 允许请求设置的Header，如果客户端请求不设置正确的Content-Type，服务器端会无法解析正确的请求参数
      ctx.set("Access-Control-Allow-Headers", "Content-Type");

      // 设置同一个请求的 preflight请求缓存多少时间(单位是s)
      // 开发者工具不要开启Disable cache
      ctx.set("Access-Control-Max-Age", 3600);

      // console.log("request data --->", ctx.request);
      // 对于预检请求
      if (ctx.request.method !== "OPTIONS") {
        // 先保存到 example.txt 中去
        console.log("__dirname", __dirname);
        const file = path.join(__dirname, "../test/data.json");
        const data = ctx.request.body;
        if (data instanceof Object) {
          data = JSON.stringify(data);
        }
        writeDataToFile(data, file);
        ctx.body = "success";
      }
    }
  });

  app.listen(3001);
  console.log("Server setup at port 3001.");
};
// testKOA();

/**
 * 完成 fs 文件的检查、写入、读取
 */
const unabridgedFileSystem = (data, file) => {
  let isExit;
  try {
    fs.accessSync(file, fs.constants.R_OK | fs.constants.W_OK);
    isExit = true;
  } catch (err) {
    console.log("no exit");
    isExit = false;
  }
  try {
    // 没有的话会自动创建
    writeDataToFile(data, testFile);
  } catch (error) {
    console.log("write fail");
  }
};

const testFile = path.join(__dirname, "../test/data.json");
const t_data = {
  user: "Json",
  age: 11,
};
// unabridgedFileSystem(JSON.stringify(t_data), testFile);
