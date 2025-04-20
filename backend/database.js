const { MongoClient } = require("mongodb");
const fs = require("fs");

const mongoDbUrl = "localhost";
const mongoDbPort = 27017;

const adminUsername = "admin";
const adminPassword = "admin";
const adminAuthDatabase = "admin";

const tlsCertificateKeyFileLocalhost = "/etc/mongoTls/mongodb.pem";
const tlsCAFileLocalhost = "/etc/mongoTls/mongodb-cert.crt";

let _db;

function createClientMongoDb(
  host = mongoDbUrl,
  port = mongoDbPort,
  username = adminUsername,
  password = adminPassword,
  authDatabase = adminAuthDatabase,
  tlsCertificateKeyFile = tlsCertificateKeyFileLocalhost,
  tlsCAFile = tlsCAFileLocalhost
) {
  const uri = `mongodb://${username}:${password}@${host}:${port}/?authSource=${authDatabase}`;
  const options = {
    tls: true,
    tlsCertificateKeyFile: tlsCertificateKeyFile,
    tlsCAFile: tlsCAFile,
  };

  return new MongoClient(uri, options);
}

const initDb = async (callback) => {
  if (_db) {
    return callback;
  } else {
    try {
      _db = await createClientMongoDb().connect();
      callback(null, _db);
    } catch (error) {
      callback(error);
    }
  }
};

const getDb = () => {
  if (!_db) {
    throw Error("Database not initialzed!");
  }
  return _db;
};

const close = async () => {
    await _db.close();
}

module.exports = {
  initDb,
  getDb,
  close
};
