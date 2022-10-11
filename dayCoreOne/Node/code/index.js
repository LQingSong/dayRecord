const fs = require("fs");

const path = require("path");

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

getFileInfo(file);
