const app = require("./app");



const cloudinary = require("cloudinary"); 

// database acquirement 
const connectDatabase = require("./config/database");



// Handling Uncaught Exception 
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to Uncaught Exception`);

    process.exit(1);

}); 



//config - to use variables in env file
// it will run on local host and on the hosting site it will not 
if(process.env.NODE_ENV !== "PRODUCTION"){
    // when hosting online it won't run we will give the variable in production time to The PRODUCTION variable to check it 
    // directly importing the env 
    // this will come in later use
    require('dotenv').config({path:"backend/config/config.env"}); 

}


// this should be done after process .env file 
// connect to database
connectDatabase();


// image upload connection - fire base can be used

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

});



// storing it into the server named variable
const server =  app.listen(process.env.PORT || 4000 ,()=>{
    console.log(`the Server is Running on http://localhost:${process.env.PORT}`)
});




// Unhandled Promise Rejection
// in this case we need to down the server as quick as possible - taki bezzeti na ho
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to Unhandled Promise Rejection`);


    // this will close our server
    server.close(()=>{
        // this will exit our server - 1 means true 
        process.exit(1)
    })
})