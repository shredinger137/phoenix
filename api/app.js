var mongo = require("mongodb");
var express = require("express");
var app = express();
var mongourl = "mongodb://localhost:27017";
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var { google } = require('googleapis');
let sheets = google.sheets('v4');
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
ObjectID = require('mongodb').ObjectID;

//Create a global holder for our database instance, then open the database and assign it here.
//Note that anywhere you use this, you need to have an if(dbConnection){} conditional so that the
//order will only attempt to run if the database connection exists. Later you might want to add a
//retry deal to it.

var dbConnection = null;
MongoClient.connect(mongourl, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) { console.error(err) }
    dbConnection = client.db('phoenix') // once connected, assign the connection to the global variable
    connectedToDatabase = true;
    console.log("Connected to Database");

    //things that happen on startup should happen here, after the database connects

})



//Google Sheets

let spreadsheetId = '1jOCZrMds1YkUW8_TXHCX6jU3hfIAjxmRFta5R57zRSU';

let privatekey = require("./credentials.json");
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    //console.log("Google connected");
  }
});

//getPracticeAttendanceAndWrite();

function getPracticeAttendanceAndWrite() {
  var allData = [];
  var firstColumn = ["Name"];
  var playerList = [];
  var holder = [];
  getPeople({ status: "active" }).then(people => {
    for (person of people) {
      firstColumn.push(person.name);
    }

    playerList = [...firstColumn];
    playerList.shift();
    allData = [firstColumn];

    getPractices().then(practices => {
      for (practice of practices) {
        holder = [practice.date];
        for (person of playerList) {
          if (practice && practice.attendance && practice.attendance.indexOf(person) > -1) {
            holder.push("Present");
          } else { holder.push("No"); }
        }
        allData.push(holder);
      }
      writeToSheet(spreadsheetId, allData);
    })



  });



}

async function updatePersonById(id, updatedObject){
  console.log(id)
  id = new mongo.ObjectID(id);
  if(connectedToDatabase){
    dbConnection.collection("people").updateOne({_id: id}, {$set: updatedObject}, function(err, res){
      if (err) throw err;
      console.log("insert")

    } );
  }
}

async function writeToSheet(sheetid, data) {
  var columnLength = data.length;
  var columnHeight = data[0].length; //we hope there are always the same number of rows
  //This can be updated to get a real range later, if we like

  const authClient = jwtClient;
  const request = {
    spreadsheetId: sheetid,
    range: 'A1:Z99',

    valueInputOption: 'RAW',

    resource: {
      "majorDimension": 'COLUMNS',
      "values": data
    },

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.values.update(request)).data;
    // TODO: Change code below to process the `response` object:
    // console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}




const cookieParser = require("cookie-parser");
const secret = "temp"; //TODO: Obviously this changes to a config thing later.
app.use(cookieParser());

var allowedOrigins = ["https://phoenix.rrderby.org", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000", "http://127.0.0.1:3000"];

app.get("/people", function (req, res) {
  var query = {};
  //TODO: This filter isn't being used in a real way.
  if (req && req.query && req.query.filters) {
    query = { status: "active" };
  }

  if (req && req.query && req.query.id) {
    query = { _id: ObjectID(req.query.id) };
    //This doesn't work.
  }

  if (req && req.query) {
    console.log(req.query);
  }

  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
  res.header('Access-Control-Allow-Credentials', true)
  if (req.cookies || req.signedCookies) {
    console.log("token")
    //TODO: We should actually do something with this token verification.
  }
  res.setHeader("Content-Type", "text/plain");
  getPeople(query).then(people => { res.send({ allPeople: people }) });

});

app.get("/practices", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
  res.setHeader("Content-Type", "text/plain");
  res.header('Access-Control-Allow-Credentials', true)

  getPractices().then(practices => res.send(practices))

});

async function getPeople(query) {
  if(dbConnection){
    return await dbConnection.collection("people").find(query).toArray();
  } else {
    return false;
  }
}

async function getPractices(query) {
  var db = await mongo.connect(mongourl);
  var dbo = db.db("phoenix");
  return await dbo.collection("practices").find(query).toArray();
}

app.get("/addperson", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
  res.setHeader("Content-Type", "text/plain");

  var newPerson = {};
  newPerson['status'] = "active";
  newPerson["creationDate"] = Date.now();
  if (req.query.name) {
    newPerson['name'] = req.query.name;
  }

  mongo.connect(
    mongourl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("phoenix");
      dbo.collection("people").insertOne(newPerson, function (err, result) {
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

app.get("/removeperson", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", origin);
  var id;
  if (req.query.id) {
    id = new mongo.ObjectID(req.query.id);
  }
  if (req.query && req.query.action && req.query.action == "undelete") {
    var action = "active";
  } else {
    var action = "deleted";
  }

  mongo.connect(
    mongourl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("phoenix");
      dbo.collection("people").updateOne({ _id: id }, { $set: { status: action } }, function (err, result) {
        if (err) throw err;
        else {
          res.send("200");
          //  console.log(id);
        }
        db.close();
      }
      );
    });
})

app.get("/updateperson", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }

  res.setHeader("Content-Type", "text/plain");
  if(req.query && req.query.id && req.query.name){
    updatePersonById(req.query.id, {name: req.query.name});
  }
  //TODO: This doesn't mean anything. We have, like, no error handling.
  res.send("200");
})

app.get("/registeraccount", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }

  res.setHeader("Content-Type", "text/plain");

  var username, password
  if (req.query.username && req.query.password) {
    username = req.query.username;
    password = req.query.password;
    if (makeAccount(username, password, res)) {
      res.send("200");
    } else { res.send("100"); }
  }
})

app.get("/verifytoken", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
  res.setHeader("Content-Type", "text/plain");

  var token = req.query.token;
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      res.send("Invalid");
    } else {
      res.send("Valid");
    }
  });
})


app.get("/login", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }

  res.setHeader("Content-Type", "text/plain");
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  var username, password
  if (req.query.username && req.query.password) {
    username = req.query.username;
    password = req.query.password;
  }

  mongo.connect(
    mongourl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("phoenix");
      dbo
        .collection("accounts")
        .findOne({ username: username }, function (err, account) {
          if (err) {
            console.log(err);
          }
          if (account) {
            if (passwordHash.verify(password, account["password"])) {

              //Issue token

              const payload = { username: username };
              const token = jwt.sign(payload, secret, {
                expiresIn: '14d'
              })
              res.cookie('token', token, { httpOnly: false })
                .send({ result: "valid_login" });
            }



            else {
              res.send({ result: "invalid_login" });
            }
          } else {
            res.send({ result: "account_not_found" });
          }
        }
        );
    }
  );



}
)

app.get("/export", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
  getPracticeAttendanceAndWrite();
  //console.log("export");
  res.send("200");

})


//Submit practice attendance. If practice didn't already exist, create it.


app.get("/rollcallsave", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
  res.setHeader("Content-Type", "text/plain");
  var date, attendance;
  if (req.query.date) {
    date = req.query.date;
  }
  if (req.query.attendance && req.query.attendance != undefined) {
    attendance = req.query.attendance;
  }

  mongo.connect(
    mongourl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("phoenix");
      dbo.collection("practices").replaceOne({ date: date }, { date: date, attendance: attendance }, { upsert: true }, function (err, result) {
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

app.get("/attendance", function (req, res) {
  var origin = req.headers.origin;
  if (req.headers.origin && req.headers.origin != undefined) {
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else { res.setHeader('Access-Control-Allow-Origin', 'https://phoenix.rrderby.org'); }
  res.setHeader("Content-Type", "text/plain");
  res.header('Access-Control-Allow-Credentials', true)
  var date;
  if (req.query.date) {
    date = req.query.date;
  }

  mongo.connect(
    mongourl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("phoenix");
      dbo
        .collection("practices")
        .findOne({ date: date }, { projection: { attendance: 1, _id: 0 } },
          function (err, attendance) {
            if (err) {
              console.log(err);
            }
            if (attendance) {
              res.send({ attendance });
            } else { res.send({ attendance: { attendance: [] } }); }
          });
    }
  );

})


function makeAccount(username, password, res) {

  var passwordHashed = passwordHash.generate(password);
  mongo.connect(
    mongourl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("phoenix");
      dbo.collection("accounts").replaceOne({ username: username }, { username: username, password: passwordHashed }, { upsert: true }, function (err, result) {
        if (err) throw err;
        else {
          db.close();
          return true;
        }

      }
      );
    });

}

function checkUsername(username) {
  mongo.connect(
    mongourl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("phoenix");
      dbo
        .collection("accounts")
        .find({ username: username })
        .toArray(function (err, account) {
          if (err) {
            console.log(err);
          }
          if (account && account.length && account.length > 0) {
            return false;
          }
          if (account && account.length && account.length == 0) {
            return true;
          }
        });
    }
  );

}



//****************************
//Google Sheets
//****************************







//****************************
//Initial run, listen
//****************************


makeAccount("admin", "admin");


app.listen(3221);