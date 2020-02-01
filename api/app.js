var mongo = require("mongodb");
var express = require("express");
var app = express();
var mongourl = "mongodb://localhost:27017";

app.get("/people", function(req, res) {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    mongo.connect(
      mongourl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("phoenix");
        dbo
          .collection("people")
          .find({})
          .toArray(function(err, allPeople) {
            if (err) {
              console.log(err);
            }
            if (allPeople) {
                res.send({ allPeople });
            }
          });
      }
    );
  });

  app.get("/addperson", function(req, res) {
    console.log("addperson");
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    var newPerson = {};
    if (req.query.name){
        newPerson['name'] = req.query.name;
    }

    mongo.connect(
      mongourl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("phoenix");
        dbo.collection("people").insertOne(newPerson, function(err, result) {
            if (err) throw err;
            else {
                res.send("200");
            }
            db.close();
      }
    );
  });
  })

  app.listen(3001);