const mongoose = require("mongoose");
//We import the products model here!!!
const Product = require("./product");

// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "Farm requires a name."],
  },
  city: {
    type: String,
  },
  email: { type: String, required: [true, "An email is required."] },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

//We must put our mongoose middleware BEFORE declaring our model.
//It is completely separate from any Express middleware.
// farmSchema.pre("findOneAndDelete", async (data) => {
//   console.log("PRE MIDDLEWARE");
//   console.log(data);
// });

//We need to require products to access them here.
farmSchema.post("findOneAndDelete", async (farm) => {
  if (farm.products.length) {
    const result = await Product.deleteMany({ _id: { $in: farm.products } });
    console.log("POST MIDDLEWARE");
    //A summary of what was done.
    console.log(result);
  }
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
