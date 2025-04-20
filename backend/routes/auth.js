const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database");

const router = Router();

const createToken = () => {
  return jwt.sign({}, "secret", { expiresIn: "1h" });
};

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  // If yes, create token and return it to client

  db.getDb()
    .db("shop")
    .collection("users")
    .findOne({ email: email })
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json({ message: "Authentication suceeded.", token: createToken() });
      } else {
        res.status(401).json({
          message:
            "Authentication failed, invalid username or password during working with db.",
        });
      }
    })
    .catch((err) => {
      res.status(401).json({
        message:
          "Authentication failed, invalid username or password during working with db.",
      });
    });
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then((hashedPW) => {
      db.getDb()
        .db("shop")
        .collection("users")
        .insertOne({
          email: email,
          password: hashedPW,
        })
        .then((result) => {
          console.log(result);
          const token = createToken();
          res.status(201).json({ token: token, user: { email: email } });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ message: "Creating the user failed." });
        });

      // Store hashedPW in database
      console.log(hashedPW);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Creating the user failed." });
    });
  // Add user to database
});

module.exports = router;
