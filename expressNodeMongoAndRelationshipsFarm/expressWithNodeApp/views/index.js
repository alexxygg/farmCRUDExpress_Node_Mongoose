const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");
// const { v4: uuid } = require("uuid");
// uuid();
//We install method-override to make an overridden request. Like put/delete
//We need to use method=post and include ?_method=delete/put etc.
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const Product = require("../models/product");
const Farm = require("../models/farm");

mongoose
  .connect("mongodb://localhost:27017/farmStand2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION FAILED");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Helps us with our post request for our FORMMMM,
//to not return undefined
app.use(express.urlencoded({ extended: true }));

const categories = ["Fruits", "Vegetables", "Dairy", "Meats", "Frozen"];
//Pattern to wait for mongoose to load data.

//////////////////////////////////
//FORMMMMMMMS
app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});
  res.render("../farms/index", { farms });
});

app.get("/farms/new", (req, res) => {
  res.render("../farms/new");
});

app.get("/farms/:id", async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("../farms/show", { farm });
});

app.delete("/farms/:id", async (req, res) => {
  const farm = await Farm.findByIdAndDelete(req.params.id);
  res.redirect("../farms");
});

app.post("/farms", async (req, res) => {
  //   res.render("../products/new", { products });
  const farm = new Farm(req.body);
  await farm.save();
  //   console.log(req.body);
  //   console.log(newProduct);
  //   res.send("creating product now!");
  res.redirect("../farms");
});

app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("../products/new", { categories, farm });
});

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  // res.send(req.body);
  //Here we link the farm to the product
  //And the product to the farm
  farm.products.push(product);
  product.farm = farm;
  //And here we save them to the database
  await farm.save();
  await product.save();
  // res.send(farm);
  res.redirect(`/farms/${id}`);
});

app.get("/products", async (req, res) => {
  //Find everything
  const products = await Product.find({});
  //   console.log(products);
  //   res.send("All products!");
  res.render("../products/index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("../products/new");
});
app.post("/products", async (req, res) => {
  //   res.render("../products/new", { products });
  const newProduct = new Product(req.body);
  await newProduct.save();
  //   console.log(req.body);
  //   console.log(newProduct);
  //   res.send("creating product now!");
  res.redirect(`../products/${newProduct._id}`);
});

//////////////////////////////////
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const farm = Farm.findById(id);
  Product.findById(id);
  const product = await Product.findById(id).populate("farm");
  //   res.send("details page");
  res.render("../products/show", { product, farm });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("../products/edit", { product });
});
//put/patch to UPDATE the values.
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  //   console.log(req.body);
  //   res.send("PUT DONE");
  res.redirect(`../products/${product._id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  //   res.send("deleted");
  res.redirect("../products");
});

app.get("/dog", (req, res) => {
  res.send("woof");
});

app.listen(3300, () => {
  console.log("App is active on port 3000");
});
