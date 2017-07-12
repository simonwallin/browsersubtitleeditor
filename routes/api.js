const express = require('express');
const router = express.Router();
const subsparser = require("subtitles-parser");
const fs = require("fs-extra");
//const db = require("../db/db.js");
const sha256 = require("sha256");
const formidable = require('formidable');
const path = require("path");

/* GET home page. */
router.get('/load', function(req, res, next) {
    fs.readFile(__dirname + "/template.srt", 'utf-8').then(data => {
      req.session.userId = new Date().getUTCMilliseconds() * (Math.random() * 100);
      req.session.userId = req.session.userId.toString().replace(".", "314");
  		res.send(subsparser.fromSrt(data));
  	});
});

router.post("/load", (req, res) => {
  let newFile;
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "uploads");
  form.on('file', function(field, file) {
    newFile = path.join(form.uploadDir, file.name);
    fs.rename(file.path, path.join(form.uploadDir, file.name), () => {
      fs.readFile(newFile, "utf-8").then(data => {
        res.send(subsparser.fromSrt(data));
      }).catch(err => {
        console.log("catch");
        console.log(err);
        res.end();
      })
    });

  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    setTimeout(() => {
      fs.unlink(newFile,(err ,data) => {
        console.log(err);
        console.log(data);
      });
    }, 1000);
  });
  form.parse(req);
});

router.post("/authenticate", (req, res) => {
  if(req.session.loggedIn){
    res.send({loggedIn: req.session.loggedIn, user: req.body.email});
  }else{
    db.users.findOne({"email": req.body.email}, (err, data) => {
      if(err){
        res.send(err)
      }else{
        // TODO this does not seem to be working
        const authenticated = sha256(req.body.password) === data.password ? true : false;
        req.session.loggedIn = authenticated;
        req.session.user = req.body.email;
        req.session.userId = data._id;
        res.send(session);
      }
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.loggedIn = false;
  req.session.user = "";
  res.send({loggedIn: req.session.loggedIn, user: req.session.user});
})

router.post("/download", (req, res) => {
  fs.writeFile(__dirname + "/subtitles" + req.session.userId + ".srt", subsparser.toSrt(req.body))
  .then((data) => {
    res.send(true);
  }).catch(() => {
    res.send(false);
  });
});
router.get("/download", (req, res) => {
  res.download(__dirname + "/subtitles" +  req.session.userId +".srt");
  setTimeout(() => {
    fs.unlink(__dirname + "/subtitles" + req.session.userId + ".srt", (err ,data) => {
      console.log(err);
      console.log(data);
    });
  }, 1000);
});

router.post("/message", (req, res) => {
  const message = JSON.stringify(req.body) + "\n";
  console.log(message);
  fs.appendFile('./messages.txt', message, function (err) {
    if (err) throw err;
  });
  res.send("success");
});



module.exports = router;
