// packages
const crypto = require("crypto");


// imports of required files and functions
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");

// for image upload
const cloudinary = require("cloudinary");




// Register A User - Sign Up Feature -  this is a different method than before verification will be done by outside
exports.registerUser = catchAsyncErrors( async(req,res,next)=>{

    // send email to the user when he registers on the site

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width: 150,
        crop:"scale",
    });

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        
       // make sure in your media library will have the folder name the avatars
        avatar:{
            // these are temporary
            public_id:myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    
    // I need to start from here now to do the project  
    
    // message wil be send in email - \n is line break
    const message = `We Welcome To Join Us , We Are Very Happy to Have you On Our Site`



        // calling the email to be send
        // this is giving the error right now 
        // await sendEmail({
        //     email: user.email,
        //     subject:`E-Commerce Registered Email`,
        //     // message from above
        //     message,

        // });

        // res.status(200).json({
        //     success:true,
        //     message:`Email sent to ${user.email} successfully`,
        // })

    // here will come the email send to user to register to the site
    // await sendEmail({
    //     email: user.email,
    //     subject:`Ecommerce Password Recovery`,
    //     // message from above
    //     message,

    // });

    // ----------------------------------------


    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success:true,
    //     // we don't need user anymore user ,
    //     token, 
    // })

    //instead of above lengthy code every where we used this method
    sendToken(user,201,res);
}
);



// Login User - Sign in - login does not working right - login with any password
exports.loginUser = catchAsyncErrors( async(req,res,next)=>{

    // this is the json input we are taking from the user at the instance not from the database 
    // json from user input is different from the data of the database for database take we use the schema object and we can only take it not create it here
    const { email,password } = req.body;

    // checking if the user have given email and password both - the  message will be first and the status code will be next
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password",400));
    }

    // if both is given 
    // finding user in database
    // we cannot write password here directly because we hashed it with bcrypt so only bcrypt can 
    // we selected password to not show so here we select it to be seen to enter
    const user = await User.findOne({ email }).select("+password");

    // if user is not found
    if(!user){
        return next(new ErrorHandler("Invalid Email Or Password",401));
    };


    // if password matched -  comparePassword will come from the user model
    // await was missing from the password match
    const isPasswordMatched = await user.comparePassword(password);

    // if not matched - didn't give only password so the user that is trying luck don't know that the email
    // exists even though the password is incorrect to confuse the random email putter
    if(!isPasswordMatched){
        // 401 is for unauthorized
        return next(new ErrorHandler("Invalid Email Or Password",401));
    };

    // if all matched  email and password
    sendToken(user,200,res);
// there is a problem in the login part saying the "next is not a function"
}
); 


// Logout the user
exports.logout = catchAsyncErrors( async(req,res,next)=>{

    res.cookie("token",null,{
        // to expire the cookie right away
        expires:new Date(Date.now()),
        httpOnly:true,
    })



    res.status(200).json({
        success:true,
        message:`Logged Out Successfully`,
    });

});



// Forget Password 
exports.forgotPassword = catchAsyncErrors( async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new  ErrorHandler("User Not Found",404));
    }

    // Get ResetPassword Token - 
    const resetToken =  user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    // for sending the link to the mail - not the hash to click and start the resetting the password process
    // if local host don't work change it to 0.0.0.0
    // the url will be changed of the data base so ${res.get("host")}=localhost and for protocol can be http or https so = ${req.protocol}
    // this will save the new generated token for the given amount of time for changing the password if it been used then password can be changed if it expires the password token just go back to normal
    // the reset is just the route
    // this will be our actual url in production mode
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;


    // this is our dummy email to generate token for the frontend - it wont be api/v1 it will start with the password url
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    
    // I need to start from here now to do the project  
    
    // message wil be send in email - \n is line break
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email for resetting password then ignore it`


    try {

        // calling the email to be send
        await sendEmail({
            email: user.email,
            subject:`Ecommerce Password Recovery`,
            // message from above
            message,

        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })

        // method to send email


        
    } catch (error) {
        // to undefined the saved data of the token and the expire time in the user schema resetPasswordToken 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // now save it -its like the sate management
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));

    }
}
);



// Reset Password
exports.resetPassword = catchAsyncErrors( async(req,res,next)=>{


    // creating token hash - takin token given to the user on email
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    // finding user using the hashed token
    const user = await User.findOne({
        resetPasswordToken,
        // time of expire should be more than the time of the current
        resetPasswordExpire:{ $gt: Date.now()},
    });

    if(!user){
        return next(new  ErrorHandler("Reset Password token is invalid or has been expired",400));
    }

    // new password entered and the confirm password did not match - like other website 
    if(req.body.password !== req.body.confirmPassword){
        return next(new  ErrorHandler("The Password Enter Doesn't Match the Confirm Password",400));
    }


    // don't know how the logic of the taking and using password works here
    // the hoisting method step by step
    user.password = req.body.password;
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // in jwtToken file
    sendToken(user,200,res)

})







// Get User Details - this route only be accessible by the user who is logged in 
exports.getUserDetails = catchAsyncErrors( async(req,res,next)=>{

    // finding user who is logged in 
    const user = await User.findById(req.user.id);

    // this function would be much longer if we try to login, authenticate and check the user all in here
    res.status(200).json({
        success:true,
        user,
    })
    
}
);


// Update User Password
exports.updatePassword = catchAsyncErrors( async(req,res,next)=>{

    // finding user who is logged in 
    const user = await User.findById(req.user.id).select("+password");

    // to check if you put the right current password you have to change it to new one
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is Incorrect" , 400));
    }


    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new  ErrorHandler("The Password Enter Doesn't Match the Confirm Password",400));
    }


    user.password = req.body.newPassword;


    await user.save();

    // this function would be much longer if we try to login, authenticate and check the user all in here

    sendToken(user,200,res)
    
}
);


//Update Profile of the User 
exports.updateProfile = catchAsyncErrors( async(req,res,next)=>{

    // taking the data input form the user in key value form - it is different from the destructuring type of intake
    const newUserData = { 
        name:req.body.name,
        email:req.body.email,
    }

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        // image public id is been saved in user.avatar the state in the redux if want to check
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
    
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }

    }

    // above we take the data based on which we want to update
    // we will add cloudinary later

    // take id to check the update based on the new user data to match it with the id and then the options based on it
    const user = await User.findByIdAndUpdate(req.user.id, newUserData ,{
        // new decide the validation of intake the new data into the object 
        new:true,
        runValidators:true,
        useFindAndModify: false,

    });


    res.status(200).json({
        success:true,
    });

}); 


// FUNCTIONALITY TO DELETE USER
exports.deleteProfile = catchAsyncErrors( async(req,res,next)=>{
    
    const user = User.findById(req.params.id);
    

    if(!user){
        return next(new ErrorHandler(`User does not exists with Id: ${req.params.id} `, 400));
    }


    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:`Your Account Deleted Successfully`
    });

})







// The Admin Routes

// Get All Users (admin) - by the admin to check no of users who have the id on the website
exports.getAllUsers = catchAsyncErrors( async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });

});

// Get Single User Detail  (admin) - by the admin to check no of users who have the id on the website
exports.getSingleUser = catchAsyncErrors( async(req,res,next)=>{

    // we use params to find here because we are not looking form the data base but from the url based if 
    // we go to the specific url to see the id after their profile to find them 
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exists with Id: ${req.params.id} `, 400));
    }

    res.status(200).json({
        success:true,
        user,
    });

});


// Update User Role (admin)
exports.updateUserRole = catchAsyncErrors( async(req,res,next)=>{

    // taking the data input form the user in key value form - it is different from the destructuring type of intake
    const newUserData = { 
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,

    }

    // we won't be able to change the name and email of the other users but we will take the user based on it and check it

    // take id to check the update based on the new user data to match it with the id and then the options based on it
    // have to be req.params.id otherwise user admin will update itself in the data base
    // if it only update if the user exits

    // mongo db will handle this error by wrong id error
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        // new decide the validation of intake the new data into the object 
        new:true,
        runValidators:true,
        useFindAndModify: false,

    });

    // if(!user){
    //     return next(new ErrorHandler(`User does not exists with Id: ${req.params.id} `, 400));
    // }


    res.status(200).json({
        success:true,
    });

});


// Delete User (admin)
exports.deleteUserProfile = catchAsyncErrors( async(req,res,next)=>{


    // we will delete profile pic uploaded by couldinary later


    // if we use req.user.id here it will update the admin himself - so level of the selection also matters 
    const user = User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exists with Id: ${req.params.id} `, 400));
    }

    // to delete the images of the user from the database when user is been deleted
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:`User Deleted Successfully`
    });

}); 

