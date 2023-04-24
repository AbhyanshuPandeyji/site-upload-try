// this is to handle error
// this is based on the object oriented programming
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode

        // this is a method - method is generally the functions we can build inside the object or class and use it inside it
        // this is a target object - it is ErrorHandler object itself
        // this.constructor - it is the constructor we used above 
        // captureStackTrace - it is to give the whole information about the error - 
        // if we use the stack after err in error.js it will give the whole error response instead of just message and status code
        Error.captureStackTrace(this,this.constructor);
    }

}

module.exports = ErrorHandler;