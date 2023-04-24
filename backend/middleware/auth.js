// for authentication the user to only be done by who is logged in 

const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");


exports.isAuthenticatedUser = catchAsyncErrors ( async(req,res,next)=>{
    const { token }= req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to access this resource",401));
    }

    // first we need the data of the user for the verification 
    // when we created jwt token we assigned the id which was mongodb _id so we just accessing that id here
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    // once we got the decoded data and 
    // till he is login we can access user data
    req.user = await User.findById(decodedData.id); 

    next();

})



// For Authorization of the Admin - is admin or not
// ...roles will access the admin from the product routes
exports.authorizeRoles = (...roles) =>{
    return ( req,res,next)=>{
        // roles is the condition we passed to be admin and the req.user.role is the data of user and its checking if the user data in role includes the admin or not

        if(!roles.includes(req.user.role)){ 
            // 403 is when server refuses the request
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403 ))};
            
            
                // if admin is included we are going to the next step which to perform the logic of the admin dashboard
                next();
        }

}
