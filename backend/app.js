const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require('cors')


const fileUpload = require("express-fileupload");

const path = require("path")

// error middleware import 
const errorMiddleware = require('./middleware/error');


// config
dotenv.config({path: "backend/config/config.env"});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
// app.use(cors({
//     origin: ['http://localhost:3000' , "https://ecommsite-9l0t.onrender.com"],
// }));


// Route imports
// for better readability can use userRoute and productRoute for good referencing
const product = require("./routes/productRoute");

// For the User Route
const user = require("./routes/userRoute");

// For the Order Route
const order = require("./routes/orderRoute");

// for payment
const payment = require("./routes/paymentRoute");

// Using routes
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);



// to take the whole build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// to get data by rendering on any url of our website - it will run even if the frontend is closed
// type local host 4000
app.get("*" , (req,res)=>{
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})



// Middle ware for error
app.use(errorMiddleware);

// module.exports is use to export the assets to all modules required as a import
module.exports = app;