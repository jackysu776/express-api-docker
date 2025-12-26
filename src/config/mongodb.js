const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://jackysu776_db_user:s95zQ9u6jWRIvFKw@testingdb.pkg0kfq.mongodb.net/?appName=testingdb";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

const connectMongoDB = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db("testingdb");
    console.log("MongoDB connected successfully!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const getDB = () => db;

const closeMongoDB = async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB:", error.message);
  }
};

module.exports = { connectMongoDB, getDB, closeMongoDB };
