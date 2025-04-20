const { MongoClient, Decimal128, ObjectId } = require("mongodb");
const client = require("./database");
const fs = require("fs");

const shopDatabaseName = "shop";
const productCollectionName = "product";

async function addDocument(
  document,
  databaseName = shopDatabaseName,
  collectionName = productCollectionName
) {
  const newDocuemnt = {
    name: document.name,
    description: document.description,
    price: Decimal128.fromString(document.price.toString()), // store this as 128bit decimal in MongoDB
    image: document.image,
  };

  try {
    const database = client.getDb().db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.insertOne(newDocuemnt);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function removeOneDocument(
  filter,
  databaseName = shopDatabaseName,
  collectionName = productCollectionName
) {
  try {
    const database = client.getDb().db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.deleteOne(filter);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function removeOneDocumentById(
  id,
  databaseName = shopDatabaseName,
  collectionName = productCollectionName
) {
  try {
    const database = client.getDb().db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.deleteOne({ _id: new ObjectId(id.toString()) });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function findDocument(
  filter,
  databaseName = shopDatabaseName,
  collectionName = productCollectionName
) {
  try {
    const database = client.getDb().db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.findOne(filter);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function findDocuments(
  filter,
  databaseName = shopDatabaseName,
  collectionName = productCollectionName
) {
  try {
    const database = client.getDb().db(databaseName);
    const collection = database.collection(collectionName);
    const result = [];

    const cursor = collection.find(filter);

    for await (const document of cursor) {
      result.push({
        _id: document._id,
        name: document.name,
        description: document.description,
        price: document.price.toString(),
        imageUrl: document.image,
      });
    }

    return result;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function aggregateDocument(
  pipeline,
  databaseName = shopDatabaseName,
  collectionName = productCollectionName
) {
  try {
    const database = client.getDb().db(databaseName);
    const collection = database.collection(collectionName);

    return collection.aggregate(pipeline);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function patchDocument(
  filter,
  updatedDocument,
  databaseName = shopDatabaseName,
  collectionName = productCollectionName
) {
  try {
    const database = client.getDb().db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.replaceOne(filter, updatedDocument);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = {
  addDocument,
  removeOneDocument,
  removeOneDocumentById,
  findDocument,
  findDocuments,
  aggregateDocument,
  patchDocument,
};
