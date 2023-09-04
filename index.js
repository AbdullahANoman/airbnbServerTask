const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
// middleware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3tx4xp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const roomsCollection = client.db("airbnbTask").collection("rooms");

    // findRooms

    app.get("/rooms", async (req, res) => {
      const query = req.query.category;
      const filter = { category: query };
      if (!query) {
        const result = await roomsCollection.find().toArray();
        res.send(result);
      } else {
        const result = await roomsCollection.find(filter).toArray();
        res.send(result);
      }
    });

    // search rooms
    app.get("/rooms/search", async (req, res) => {
      const query = req.query;
      console.log(query);
      const filter = {
        location: query?.location,
        availableCheckInMonth: query?.checkIn.split(" ")[0],
        availableCheckInDate: parseFloat(query?.checkIn.split(" ")[1]),
        availableCheckOutMonth: query?.checkOut.split(" ")[0],
        availableCheckOutDate: parseFloat(query?.checkOut.split(" ")[1]),
        guest: parseFloat(query?.guest),
      };
      console.log(filter);
      if (query) {
        const result = await roomsCollection.find(filter).toArray();
        res.send(result);
      }
    });
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("AirBNB Simple Task Project  Server is running..");
});

app.listen(port, () => {
  console.log(`AirBNB Simple Task Project is running on port ${port}`);
});
