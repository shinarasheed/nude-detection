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

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  var sightengine = require("sightengine")(
    "1071904721",
    "ejcyxQxPMubXT6P3PDzy"
  );

  file.mv(`${__dirname}/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }

    sightengine
      .check(["nudity"])
      .set_file(`${__dirname}/public/uploads/${file.name}`)
      .then(function (result) {
        console.log(result.nudity.raw);
      })
      .catch(function (err) {
        console.error(err);
      });
    // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.listen(5000, () => console.log("server started"));
