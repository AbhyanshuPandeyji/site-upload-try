const mongoose = require("mongoose");
// to validate email
const validator = require("validator");
// to secure password
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crypto = require("crypto"); // it comes along already its a building module

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name Cannot Exceed 30 Characters"],
        minLength:[4,"Name Should have More Than 4 Character"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter A valid Email"],
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password Should be greater Than 8 Characters"],
        select:false,
    },
    // not an array because it will be only one image - will be on cloudanary
    avatar:{
            
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }        
    },
    role:{
        type:String,
        default: "user" // till we make him a admin
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,

});

// it will be an event - pre will done it before user save his data and the function will be the action will be performed 
// function why? because we will use this and you cannot use this keyword in the arrow function because you have no where that the this keyword will give back value to 
userSchema.pre("save", async function(next){


    // to avoid the password rehashing in case of update of the id we use this if statement
    // if password is not modified then password will not rehash and it will go to next step 
    if(!this.isModified("password")){
        next();
    }

    // if password changed
    // 10 is the power of how strong the password should be 10 will be basic to say that your password is strong
    // the longer the power the more will be the stronger password but more power will be consumed thats why we use await in it
    // we could have also passed the power like this  - const salt = bcrypt.genSaltSync(10);
    
    this.password = await bcrypt.hash(this.password,10);  

});

// JWT Token 
// to say this user is saved and can access the authorized routes
userSchema.methods.getJWTToken = function(){
    // we are creating the jwt token
    // process.env.JWT_SECRET - if someone got this key of yours then he can create a bunch of fake admin accounts in your site
    // which basically means he can manipulate the data of your site as he likes and your site and your users data will be unsafe
    // thats why we hide our .env file from the world so no one could access our app without proper authorization
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        // to logout the user after a certain amount of time without login or 
        // expiration at certain limits of dates to ask re login after sometime
        // this will token expire
        expiresIn: process.env.JWT_EXPIRE,
    });
};



// Compare Password
userSchema.methods.comparePassword = async function(password){
    // but the password is hashed then how we will compare - by bcrypt - bcrypt.compareSync() function
    // this is the user schema or the object we created 
    // await was missing
    return await bcrypt.compare(password,this.password);

}


// Generating password reset token
userSchema.methods.getResetPasswordToken = function(){

    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // the crypto basic needed


    // Hashing and adding to userSchema - the reset password and the password expire are in the user schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // validation of the reset password code generated - the otp thing - 15 minute window to change the password
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;


    return resetToken;
    // now we will send the mail to the user for the reset password - using nodemailer
    // we will send this resetToken to the mail and anyone who clicks on the link can reset the password
}



module.exports = mongoose.model("User", userSchema);