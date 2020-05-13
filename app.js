//jshint esversion : 6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
var port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.First_Name;
  const lastName = req.body.Last_Name;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/4b04d073e5";

  const options = {
    method: "POST",
    auth: "ankit:ac5cd0497e2d059b8d4f324eec418913-us8",
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});



app.listen(process.env.PORT || port, function() {
  console.log("Server has been started on port " + port);
});


// mailchimp client key
// ac5cd0497e2d059b8d4f324eec418913-us8
// list
// 4b04d073e5
