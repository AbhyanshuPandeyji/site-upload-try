const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    // This is for the Shipping Address
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        // for international - if want for just one then use the by default  Country name
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        },
    },

    // This Is for the Order Item
    orderItems:[
        {
            name:{
                type: String,
                required: true,
            },
            quantity:{
                type: Number,
                required: true,
            },
            price:{
                type: Number,
                required: true,
            },
            image:{
                type: String,
                required: true,
            },
            product:{
                type:mongoose.Schema.ObjectId,
                // Product Here is referencing to the Product Schema
                ref:"Product",
                required:true,
            },
        },
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        // User Here is referencing to  the  User schema
        ref:"User",
        required:true,
    },

    paymentInfo:{
        id:{
            type: String,
            required:true,
        },
        status:{
            type: String,
            required:true,
        },
    },

    paidAt:{
        type:Date,
        required:true,
    },

    // this Will be calculated in the front end
    itemPrice:{
        type:Number,
        required:true,
        default:0,
    },

    taxPrice:{
        type:Number,
        required:true,
        default:0,
    },

    shippingPrice:{
        type:Number,
        required:true,
        default:0,
    },

    totalPrice:{
        type:Number,
        required:true,
        default:0,
    },

    orderStatus:{
        type:String,
        required:true,
        default:"Processing",
    },

    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now,
    },
});


module.exports = mongoose.model("Order", orderSchema);