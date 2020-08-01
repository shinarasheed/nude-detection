const express = require("express");
const path = require("path");
const fs = require("fs");
var imagePath1 = "./public/react.png";
var imagePath2 = "./public/porn.jpg";
const fileupload = require("express-fileupload");
const axios = require("axios");
const picpurifyUrl = "https://www.picpurify.com/analyse/1.1";
const request = require("request");

const app = express();

app.use(express.static(`${__dirname}/public`));

app.use(fileupload());

//upload endpoint

// app.get("/", (req, res) => {
//   var data = {
//     file_image: fs.createReadStream(imagePath2),
//     API_KEY: "lSrJlVG6eH029N9SdGZVNwWQeHaJ5o0M",
//     task: "porn_moderation",
//   };

//   request.post({ url: picpurifyUrl, formData: data }, function (
//     err,
//     httpResponse,
//     body
//   ) {
//     if (!err && httpResponse.statusCode == 200) {
//       const response = JSON.parse(body);
//       console.log(response);
//     }
//   });
//   res.send("hello");
// });

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  file.mv(`${__dirname}/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });

  // console.log(file);

  var data = {
    file_image: `uploads/${file.name}`,
    API_KEY: "lSrJlVG6eH029N9SdGZVNwWQeHaJ5o0M",
    task: "porn_moderation",
  };

  console.log(data.file_image);

  request.post({ url: picpurifyUrl, formData: data }, function (
    err,
    httpResponse,
    body
  ) {
    if (!err && httpResponse.statusCode == 200) {
      console.log(body);
      const response = JSON.parse(body);
      if (response.porn_moderation.porn_content === true) {
        return res.status(400).json({
          msg: "porn alert",
        });
      }

      console.log("success");
    }
  });
});

app.listen(5000, () => console.log("server started"));
