import  express  from 'express';
import mongoose from 'mongoose';
import cors from 'cors'

const productSchema = new mongoose.Schema({
    ProductName: String,
    productPrice: Number,
    currencyCode: String,
    numberOfSale: Number,
    rating: Number,
    isFreeShipping: Boolean,
    shopName: String,
    createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model('Product', productSchema);







let app = express()
app.use(express.json())
app.use(cors())


app.get("/products",async (req, res)=>{

    let result = await productModel
    .find({})
    .exec()
    .catch(e => {
        console.log("error in db: ", e);
        res.status(500).send({ message: "error in getting all products" });
        return
    })





res.send({
    message:"all produsts successfully added",
    data:result})
})

app.get("/product/:id", async (req, res) => {

    let result = await productModel
        .findOne({_id: req.params.id})
        .exec()
        .catch(e => {
            console.log("error in db: ", e);
            res.status(500).send({ message: "error in getting all products" });
            return
        })

    res.send({
        message: "all products success ",
        data: result
    });
});









app.post("/product",async (req, res)=>{

let body = req.body
if(
    !body.ProductName
    ||!body. productPrice
    ||!body.currencyCode
    ||!body.numberOfSale
    ||!body.rating
    ||!body.isFreeShiping
    ||! body.shopName
)
  {
    res.status(400).send({
        message:`required fields are missing
        ProductName
     productPrice
    currencyCode
    numberOfSale
    rating
    isFreeShiping
     shopName`
     

    })
    return
  }  
 

 let result = await productModel.create({
    ProductName:   body.ProductName,
    productPrice:  body. productPrice,
    currencyCode:  body.currencyCode,
    numberOfSale:  body.numberOfSale,
    rating:        body.rating,
    isFreeShiping: body.isFreeShiping,
    shopName:      body.shopName,
}).catch(e =>{
console.log("error in db ")
res.status(400).send( {message:"db error in saving product"})
})


console.log("result", result)
res.send({message:"product is added in database"})

    
})

let PORT = process.env.PORT|| 3000 
app.listen(PORT, ()=>{
    console.log(`app is running on ${PORT}`)
})



let dbURI = 'mongodb+srv://abc:abc@cluster0.xwbyne9.mongodb.net/ecommerceDatabase?retryWrites=true&w=majority';

mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
