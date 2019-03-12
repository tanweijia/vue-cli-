var express = require("express");
var router = express.Router();
var multer = require("multer");
var { connect, insert, find, ObjectId } = require("../libs/mongodb.js");
var storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹会自动创建。
  destination: function(req, file, cb) {
    // console.log(1)
    cb(null, "./uploads");
  },
  //给上传文件重命名，获取添加后缀名
  filename: function(req, file, cb) {
    var fileFormat = file.originalname.split(".");
    //给图片加上时间戳格式防止重名名
    //比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        fileFormat[fileFormat.length - 1]
    );
  }
});
var upload = multer({
  storage: storage
});
router.post("/upload", upload.single("file_img"), function(req, res, next) {
  // console.log(req)
  res.json({
    status: "success",
    file: req.file
  });
});

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/findUser", async (req, res, next) => {
  let {
    key1,
    key2
    // id,
  } = req.body;
  // console.log(req.body)
  // console.log(key1)
  let data = await find(`mblx`, {
    name: key1
  });
  // console.log(data[0].password)
  // console.log(data)
  if (data[0] && data[0].password === key2) {
    res.send({
      status: "success"
    });
  } else {
    res.send({
      status: "fail"
    });
  }
});
router.post("/insert", async (req, res, next) => {
  let { key1, key2 } = req.body;
  let data = await find(`mblx`, {
    name: key1
  });
  //查找用户名
  if (data[0]) {
    res.send({
      status: "用户名已存在"
    });
  } else {
    data = await insert(`mblx`, [{ name: key1, password: key2 }]);
    // console.log(data)
    res.send({
      status: "注册成功"
    });
  }
});

module.exports = router;
