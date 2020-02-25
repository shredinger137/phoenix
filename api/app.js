var mongo = require("mongodb");
var express = require("express");
var app = express();
var mongourl = "mongodb://localhost:27017";
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const secret = "temp"; //TODO: Obviously this changes to a config thing later.
app.use(cookieParser());

var allowedOrigins = ["https://phoenix.rrderby.org", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000", "http://127.0.0.1:3000"];

app.get("/people", function(req, res) {
  var query = {};
  if(req && req.query && req.query.filters){
    query = {status: "active"};
  }
  
  var origin = req.headers.origin;
  if(req.headers.origin && req.headers.origin != undefined){
    if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
    }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
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
          .find(query)
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
    var origin = req.headers.origin;
    if(req.headers.origin && req.headers.origin != undefined){
      if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", origin);
    var newPerson = {};
    newPerson['status'] = "active";
    newPerson["creationDate"] = Date.now();
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
    var origin = req.headers.origin;
    if(req.headers.origin && req.headers.origin != undefined){
      if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", origin);
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
    var origin = req.headers.origin;
    if(req.headers.origin && req.headers.origin != undefined){
      if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }

    res.setHeader("Content-Type", "text/plain");

    var username, password
    if (req.query.username && req.query.password){
        username = req.query.username;
        password = req.query.password;
        if(makeAccount(username, password, res)){
          res.send("200");
        } else { res.send("100");}
    }
  })

  app.get("/verifytoken", function(req, res) {
    var origin = req.headers.origin;
    if(req.headers.origin && req.headers.origin != undefined){
      if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
    res.setHeader("Content-Type", "text/plain");

    var token = req.query.token;
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
      res.send("Invalid"); } else {
      res.send("Valid");}
    });
  })


  app.get("/login", function(req, res) {
    var origin = req.headers.origin;
    if(req.headers.origin && req.headers.origin != undefined){
      if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }

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

                const payload = { username: username };
                const token = jwt.sign(payload, secret, {
                  expiresIn: '14d'
                })
                res.cookie('token', token, { httpOnly: false })
                .send({result: "valid_login"}); 
                console.log(token);}
            


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


  //Submit practice attendance. If practice didn't already exist, create it.

  app.get("/rollcallsave", function(req, res) {
    var origin = req.headers.origin;
    if(req.headers.origin && req.headers.origin != undefined){
      if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
    res.setHeader("Content-Type", "text/plain");
    var date, attendance;
    if (req.query.date){
        date = req.query.date;
    }
    if(req.query.attendance && req.query.attendance != undefined){
      attendance = req.query.attendance;
    }

    mongo.connect(
      mongourl,
      { useNewUrlParser: true, useUnifiedTopology: true},
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("phoenix");
        dbo.collection("practices").replaceOne({date: date}, {date: date, attendance: attendance}, {upsert: true}, function(err, result) {
          if (err) throw err;
          else {
            db.close();
            return true;
          }
        })
      }
    )
    res.send("200");
  })

  app.get("/attendance", function(req, res) {
    var origin = req.headers.origin;
    if(req.headers.origin && req.headers.origin != undefined){
      if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }} else {res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
    res.setHeader("Content-Type", "text/plain");
    var date;
    if (req.query.date){
        date = req.query.date;
    }

    mongo.connect(
      mongourl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("phoenix");
        dbo
          .collection("practices")
          .findOne({date: date}, {projection: {attendance: 1, _id: 0}},
          function(err, attendance) {
            if (err) {
              console.log(err);
            }
            if (attendance) {
                res.send({ attendance });
            } else {res.send({attendance: {attendance: []}});}
          });
      }
    );

  })


  function makeAccount(username, password, res){

      var passwordHashed = passwordHash.generate(password);
      mongo.connect(
        mongourl,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function(err, db) {
          if (err) throw err;
          var dbo = db.db("phoenix");
          dbo.collection("accounts").replaceOne({username: username}, {username: username, password: passwordHashed}, {upsert: true}, function(err, result) {
              if (err) throw err;
              else {
                  db.close();
                  return true;
              }
              
        }
      );
    });
  
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

makeAccount("admin", "admin");


app.listen(3221);