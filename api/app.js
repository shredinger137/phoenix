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
    newPerson['status'] = "active";
    newPerson["creationDate"] = Date.now();  //this is new to me, so we'll see what it does
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


  //Includes delete and undelete

  app.get("/removeperson", function(req, res) {
    console.log("delete");
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    var id;
    if (req.query.id){
        id = new mongo.ObjectID(req.query.id);
    }
    if (req.query && req.query.action && req.query.action =="undelete"){
      var action = "active";
    } else {
      var action = "deleted";
    }

    mongo.connect(
      mongourl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("phoenix");
        dbo.collection("people").updateOne({_id: id}, {$set: {status: action}}, function(err, result) {
            if (err) throw err;
            else {
                res.send("200");
                console.log(id);
            }
            db.close();
      }
    );
  });
  })

  app.listen(3221);