const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3005;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.URI}`;

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

        // database
        const nutritionTips = client
            .db("nutrinoDB")
            .collection("nutritionTipsHome");

        // getting data from nutritionTips
        app.get("/nutritionTips", async (req, res) => {
            const cursor = nutritionTips.find();
            const result = await cursor.toArray();
            res.send(result);
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

// checking server health
app.get("/health", (req, res) => {
    res.send("nutrino server health is OK!");
});

// error handling
app.all("*", (req, res, next) => {
    const error = new Error(`the requested url is invalid : [${req.url}]`);
    error.status = 400;
    next(error);
});
app.use((err, req, res, next) => {
    // console.log('from line 50');
    res.status(err.status || 500).json({
        message: err.message,
    });
});

app.listen(port, () => {
    console.log(`port running on : ${port}`);
});
