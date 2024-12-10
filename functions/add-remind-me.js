const { MongoClient } = require("mongodb");

// MongoDB connection string (use environment variables for security)
require("dotenv").config();
const uri = process.env.MONGO_URI;

console.log(uri);

const client = new MongoClient(uri);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse request body (assumes JSON format)

    console.log(event.body);
    console.log(event.body.name);

    const data = JSON.parse(event.body);

    // Connect to MongoDB
    await client.connect();
    const database = client.db("loot-remind-me");
    const collection = database.collection("reminders");

    // Add data to the collection
    const result = await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data added successfully!", result }),
    };
  } catch (error) {
    console.error(error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to add data", details: error.message }),
    };
  } finally {
    await client.close();
  }
};
