const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
var port = process.env.PORT || 3000;

//MONGODB CONFIG
const MongoClient = require('mongodb').MongoClient;
const uri = "";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var visitCollection;  //I initialize it here because if scope, I want to be able to access it from everywhere

// Express config
const app = express();

app.use(express.static("public")); //to recognize path of local files
app.use(bodyParser.urlencoded({extended: true})); //to read html files
app.use(async (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    var document = await visitCollection.findOne({ ip: ip });
    if (document == null) {
        await visitCollection.insertOne({ ip: ip, time: dateTime });
    }

    next(); //callback that goes to next middleware
});

// Use EJS to treat views
app.set('view engine', 'ejs');

app.get("/", function(req,res) {
    res.render(__dirname + "/views/index.ejs");
});

app.get("/count", async function (req, res) {
    var count = await visitCollection.countDocuments();
    res.send("" + count);
});

app.get("/commercant", function(req,res) {
    res.render(__dirname + "/views/commercant.ejs");
});

app.get("/legende", function(req,res) {
    res.render(__dirname + "/views/colibri-legend.ejs");
});

app.get("/equipe", function(req,res) {
    res.render(__dirname + "/views/equipe.ejs");
});

app.get("/processus", function(req,res) {
    res.render(__dirname + "/views/processus.ejs");
});

app.get("/produits", function(req,res) {
    res.render(__dirname + "/views/produits.ejs");
});

app.get("/eshop", function(req, res) {
    res.render(__dirname + "/views/ecommerce.ejs");
});

app.get("/cart", function(req, res) {
    res.render(__dirname + "/views/cart.ejs");
});

app.post("/form-data", function (req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    const company = req.body.company;
    const email = req.body.email;

    console.log(req.body.name);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name,
                    LNAME: surname,
                    CNAME: company
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = ""
    const options = {
        method: "POST",
        auth: ''
    };

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(JSON.parse(data));

            if (response.statusCode === 200) {
                res.send({ status: true });
            }
            else {
                res.send({ status: false });
            }
        })
        .on("error", function(data) {
            res.send({ status: false });
        });
    });

    request.write(jsonData);
    request.end();
});

// 404 middleware
app.use(function(req, res, next) {
    res.status(404);
    res.render(__dirname + "/views/50x.ejs");
});

//I set up everything, then I laucnh the server
client.connect(err => {
    if (err) {
        throw err;
    }
    console.log("Connection to mongodb successful");

    visitCollection = client.db().collection("visits");
    app.listen(port, function() {
        console.log("Listening to port 3000");
    });
});

// app.listen(port, function() {
//     console.log("Listening to port 3000");
// });