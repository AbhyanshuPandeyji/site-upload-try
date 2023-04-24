// to reduce our line of code in logic to run the getJWTToken and sending the response back

// Create token and saving in the cookie

// we will take the status user status code and give a response back in the end to the place where the function is being called
const sendToken = (user,statusCode,res)=>{

    // getJWTToken is the function that is in the User model that will generate token by taking user- id , Jwt secret code and time it Generated 
    const token = user.getJWTToken();

    // options for cookie
    const options = {
        // when will cookie expires
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000, // cookie_expire will be in days then we are just multiplying it with the total amount of the time in a day
            // eg if we give it 7 days it will expire after 7 * all the millie seconds in a day 
        ),
        httpOnly:true,


    };

    res.status(statusCode).cookie('token', token , options ).json({
        success:true,
        user,
        token,
});

};


module.exports = sendToken;