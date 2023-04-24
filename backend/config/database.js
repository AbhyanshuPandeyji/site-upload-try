const mongoose = require("mongoose");


// to connect it from the server.js file
const connectDatabase = async() => {

    // this local host string is used because we using it on local host and using online cloud -
    // we won't want to change it every time - so we make a variable in env file to change the url just there
    mongoose.connect(process.env.DB_URI, {useUnifiedTopology:true}).then((data)=> {
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
};

module.exports = connectDatabase;
