const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://jackysu776_db_user:s95zQ9u6jWRIvFKw@testingdb.pkg0kfq.mongodb.net/?appName=testingdb";

console.log('MongoDB URI configured:', uri.substring(0, 50) + '...');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxIdleTimeMS: 60000,
});

let db = null;
let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected && db) {
    console.log('MongoDB already connected');
    return db;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    isConnected = true;
    console.log('Connected to MongoDB server');
    
    await client.db("admin").command({ ping: 1 });
    console.log('MongoDB ping successful');
    
    db = client.db("testingdb");
    console.log("MongoDB connected successfully!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Full error:", error);
    isConnected = false;
    throw error;
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
