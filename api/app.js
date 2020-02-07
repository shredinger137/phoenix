var mongo = require("mongodb");
var express = require("express");
var app = express();
var mongourl = "mongodb://localhost:27017";
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const secret = "temp"; //TODO: Obviously this changes to a config thing later.
app.use(cookieParser());

app.get("/people", function(req, res) {
  var allowedOrigins = ["https://phoenix.rrderby.org", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000"];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', true)

    if(req.cookies || req.signedCookies){ console.log("token")}

    res.setHeader("Content-Type", "text/plain");
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

  app.get("/registeraccount", function(req, res) {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    var username, password
    if (req.query.username && req.query.password){
        username = req.query.username;
        password = passwordHash.generate(req.query.password);
        if(makeAccount(username, password, res)){
          res.send("200");
        } else { res.send("100");}
    }
  })

  app.get("/login", function(req, res) {
    var allowedOrigins = ["https://phoenix.rrderby.org", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000"];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    console.log("Triggered login");
    res.setHeader("Content-Type", "text/plain");
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    var username, password
    if (req.query.username && req.query.password){
        username = req.query.username;
        password = req.query.password;
    }

    mongo.connect(
      mongourl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("phoenix");
        dbo
          .collection("accounts")
          .findOne({username: username}, function(err, account){
            if (err) {
              console.log(err);
            }
            if(account){
              if(passwordHash.verify(password, account["password"])){

                //Issue token

                const payload = { username };
                const token = jwt.sign(payload, secret, {
                  expiresIn: '14d'
                })
                res.cookie('token', token, { httpOnly: true })
                .sendStatus(200); }
            


               else {
                  res.send({result: "invalid_login"});
                }
              } else {
                res.send({result: "account_not_found"});
              }
            }
          );
      }
    );



    }
  )

  function makeAccount(username, password, res){
    if(checkUsername(username)){
      mongo.connect(
        mongourl,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function(err, db) {
          if (err) throw err;
          var dbo = db.db("phoenix");
          dbo.collection("accounts").insertOne({username: username, password: password}, function(err, result) {
              if (err) throw err;
              else {
                  db.close();
                  return true;
              }
              
        }
      );
    });
  }
  }




  function checkUsername(username){
    mongo.connect(
      mongourl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("phoenix");
        dbo
          .collection("accounts")
          .find({username: username})
          .toArray(function(err, account) {
            if (err) {
              console.log(err);
            }
            if (account && account.length && account.length > 0) {
              return false;
            } 
            if (account && account.length && account.length == 0){
              return true;
            }
          });
      }
    );
    
  }


  app.listen(3221);