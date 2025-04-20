const { MongoClient, Decimal128 } = require("mongodb");
const fs = require("fs");

function createClientMongoDb(
  host = "localhost",
  port = 27017,
  username = "admin",
  password = "admin",
  authDatabase = "admin",
  tlsCertificateKeyFile = "/etc/mongoTls/mongodb.pem",
  tlsCAFile = "/etc/mongoTls/mongodb-cert.crt",
  databaseName = "shop",
  collectionName = "customer"
) {
  const uri = `mongodb://${username}:${password}@${host}:${port}/?authSource=${authDatabase}`;
  const options = {
    tls: true,
    tlsCertificateKeyFile: tlsCertificateKeyFile,
    tlsCAFile: tlsCAFile,
  };

  return new MongoClient(uri, options);
}

async function addDocument(
  document,
  databaseName = "shop",
  collectionName = "product"
) {
  const client = createClientMongoDb();
  const newDocuemnt = {
    name: document.name,
    description: document.description,
    price: Decimal128.fromString(document.price.toString()), // store this as 128bit decimal in MongoDB
    image: document.image,
  };

  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.insertOne(newDocuemnt);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

async function removeOneDocument(
  filter,
  databaseName = "shop",
  collectionName = "product"
) {
  const client = createClientMongoDb();

  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.deleteOne(filter);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

async function removeOneDocumentById(
  id,
  databaseName = "shop",
  collectionName = "product"
) {
  const client = createClientMongoDb();

  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.deleteOne({_id: id});
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

async function findDocument(
  filter,
  databaseName = "shop",
  collectionName = "product"
) {
  const client = createClientMongoDb();

  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.findOne(filter).toArray();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

async function findDocuments(
  filter,
  databaseName = "shop",
  collectionName = "product"
) {
  const client = createClientMongoDb();

  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    return await collection.find(filter).toArray();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

async function aggregateDocument(
  pipeline,
  databaseName = "shop",
  collectionName = "product"
) {
  const client = createClientMongoDb();

  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    return collection.aggregate(pipeline);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

async function patchDocument(
  filter,
  updatedDocument,
  databaseName = "shop",
  collectionName = "product"
) {
  const client = createClientMongoDb();

  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    return collection.updateOne(filter, updatedDocument);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

module.exports = {
  createClientMongoDb,
  addDocument,
  removeOneDocument,
  removeOneDocumentById,
  findDocument,
  findDocuments,
  aggregateDocument,
  patchDocument
};
