const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb+srv://jothika:jothika@cluster0.uyxgqyk.mongodb.net/EcommerceDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  const ProductSchema =new mongoose.Schema({
  image: String,
  name: String,
  description:String,
  selling_price: String,
  actual_price: String,
  discount: String,
  ratings: String,
  rating: String,
  reviews: String,
  color: String,
  size: {
    type:Object
  },
  specifications:{
    type:Object
  },
  variants:[
    {
      _id:{
        type:mongoose.Schema.Types.ObjectId,auto:true
      },
      image: String,
      color: String,
      size: {
        type:Object
      },
      specifications:{
      type:Object
      },
      selling_price: String,
      actual_price: String,
      discount: String,
      sku: String,
      stock:{
         type:Number,
         default:0
          } 
    }
  ]
})
const Product = mongoose.model("Product",ProductSchema);

app.get("/order",async(req,res)=>{
  try{
    const orders = await mongoose.connection.db
    .collection("orders").find().toArray();
    res.json(orders); 
    console.log(orders)  
  }catch(err){
    res.status(500).json(err)
  }
})


const { ObjectId } = require("mongodb");

app.get("/order/:id", async (req, res) => { 
 try {
  const order = await mongoose.connection.db
    .collection("orders")
    .findOne({ _id: new ObjectId(req.params.id) });

  res.json(order);
 } catch (err) {
  res.status(500).json(err);
 }
});

app.put("/orderstatus/:id", async (req,res)=>{
 try{

  const order = await mongoose.connection.db
    .collection("orders")
    .findOneAndUpdate(
      {_id:new ObjectId(req.params.id)},
      {$set:{status:req.body.status}},
      {returnDocument:"after"}
 )
 res.json(order.value)

 }catch(err){
  res.status(500).json(err)
 }
})

app.get("/product", async (req, res) => {
  try {
    const products = await mongoose.connection.db
      .collection("products") 
      .find()
      .toArray(); 
      res.json(products) 
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post("/product", async (req, res) => {
  try {
    const newProduct = new Product(req.body); 
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});



app.get("/test", (req, res) => {
  res.send("TESTING OK");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});