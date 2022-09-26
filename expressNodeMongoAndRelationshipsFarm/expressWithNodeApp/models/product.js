const mongoose = require("mongoose");
//We import the products model here!!!
const Farm = require("./farm");

// const Schema = mongoose.Schema;
const { Schema } = mongoose;
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruits", "vegetables", "dairy"],
  },
  farm: { type: Schema.Types.ObjectId, ref: "Farm" },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
