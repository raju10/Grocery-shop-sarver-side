const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const port = 1000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//////////////
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yaeov.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("freshVally").collection("products");
  const odersCollection = client.db("freshVally").collection("oder");
  /////////////Admain post/////////////////
  app.post("/addEvent", (req, res) => {
    const products = req.body;
    console.log("adding new event :", products);

    productsCollection.insertOne(products).then((result) => {
      console.log("insertedCount", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/events", (req, res) => {
    productsCollection.find().toArray((err, items) => {
      console.log("form data base", items);
      res.send(items);
    });
  });

  //////////Client post /////////////
  app.post("/addOrderEvents", (req, res) => {
    const oder = req.body;
    console.log("adding new event :", oder);

    odersCollection.insertOne(oder).then((result) => {
      console.log("insertedCount", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/OrderEventss", (req, res) => {
    // console.log("niyaaa", req.query.email);
    odersCollection.find({ email: req.query.email }).toArray((err, items) => {
      console.log("form data base", items);
      res.send(items);
    });
  });

  ///////////deleted ////////////

  app.delete("/delete/:id", (req, res) => {
    odersCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
      });
    console.log(req.params.id);
  });
});

app.listen(process.env.PORT || port);
