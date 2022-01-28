const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4b6iz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("AnchorTravelAgency");

    // Collections
    const reviewsCollection = database.collection("reviews");
    const blogCollection = database.collection("blogs");
    const usersCollection = database.collection("users");

    ///////////////////////////
    //// Review Collection ////
    ///////////////////////////

    // GET API
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // Load data according to UID
    app.get("/userWiseReviews/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      console.log(query);
      const result = reviewsCollection.find(query);
      const reviews = await result.toArray();
      res.json(reviews);
    });

    // POST API
    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const cursor = await reviewsCollection.insertOne(newReview);
      res.send(cursor);
    });

    // DELETE API
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.json(result);
    });

    // GET Single Data API
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewsCollection.findOne(query);
      res.json(review);
    });

    ///////////////////////////
    //// Blog Collection ////
    ///////////////////////////

    // GET API
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    // POST API
    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);
      const cursor = await blogCollection.insertOne(newBlog);
      res.send(cursor);
    });

    // DELETE API
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.json(result);
    });

    // GET Single Data API
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.json(blog);
    });

    //////////////////////
    ////// Users /////////
    //////////////////////
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    ///////////////////////
    ///// Cart ///////////
    ///////////////////////

    // Load Cart Data According To User ID
    app.get("/cart/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await cartCollection.find(query).toArray();
      res.json(result);
    });

    // GET Cart Data
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // Add Data to cart collection
    app.post("/cart/add", async (req, res) => {
      const service = req.body;
      const result = await cartCollection.insertOne(service);
      res.json(result);
    });

    // DELETE From cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server from node server");
});

app.listen(port, () => {
  console.log("listing form port ", port);
});
