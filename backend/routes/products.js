const { ObjectId } = require("mongodb");
const {
  addDocument,
  removeOneDocument,
  removeOneDocumentById,
  findDocument,
  patchDocument,
  findDocuments,
} = require("../connectToMongoDB");

const Router = require("express").Router;

const router = Router();

const products = [
  {
    _id: "fasdlk1j",
    name: "Stylish Backpack",
    description:
      "A stylish backpack for the modern women or men. It easily fits all your stuff.",
    price: 79.99,
    image: "http://localhost:3100/images/product-backpack.jpg",
  },
  {
    _id: "asdgfs1",
    name: "Lovely Earrings",
    description:
      "How could a man resist these lovely earrings? Right - he couldn't.",
    price: 129.59,
    image: "http://localhost:3100/images/product-earrings.jpg",
  },
  {
    _id: "askjll13",
    name: "Working MacBook",
    description:
      "Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!",
    price: 1799,
    image: "http://localhost:3100/images/product-macbook.jpg",
  },
  {
    _id: "sfhjk1lj21",
    name: "Red Purse",
    description: "A red purse. What is special about? It is red!",
    price: 159.89,
    image: "http://localhost:3100/images/product-purse.jpg",
  },
  {
    _id: "lkljlkk11",
    name: "A T-Shirt",
    description:
      "Never be naked again! This T-Shirt can soon be yours. If you find that buy button.",
    price: 39.99,
    image: "http://localhost:3100/images/product-shirt.jpg",
  },
  {
    _id: "sajlfjal11",
    name: "Cheap Watch",
    description: "It actually is not cheap. But a watch!",
    price: 299.99,
    image: "http://localhost:3100/images/product-watch.jpg",
  },
];

// Get list of products products
router.get("/", async (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  let resultProducts = [...products];

  const productsFromDb = await findDocuments({});
  if (productsFromDb) {
    resultProducts = [...products, ...productsFromDb];
  }
  
  const queryPage = req.query.page;
  const pageSize = 5;

  if (queryPage) {
    resultProducts = products.slice(
      (queryPage - 1) * pageSize,
      queryPage * pageSize
    );
  }
  res.json(resultProducts);
});

// Get single product
router.get("/:id", async (req, res, next) => {
  let product = products.find((p) => p._id === req.params.id);

  if (!product) {
    product = await findDocument({ _id: new ObjectId(req.params.id.toString()) });
  }

  res.json(product);
});

// Add new product
// Requires logged in user
router.post("", async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  await addDocument(newProduct);
  res.status(201).json({ message: "Product added", productId: "DUMMY" });
});

// Edit existing product
// Requires logged in user
router.patch("/:id", async (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };

  await patchDocument({ _id: new ObjectId(req.params.id.toString()) }, updatedProduct);
  res.status(200).json({ message: "Product updated", productId: "DUMMY" });
});

// Delete a product
// Requires logged in user
router.delete("/:id", async (req, res, next) => {
  await removeOneDocumentById(req.params.id);
  res.status(200).json({ message: "Product deleted" });
});

module.exports = router;
