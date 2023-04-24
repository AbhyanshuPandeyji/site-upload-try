// Order routes Logical Part / Functional component

const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
// we Will require product to create an order
const Product = require("../models/productModel");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");


exports.newOrder = catchAsyncErrors(async (req, res, next) => { // taking in the data - destructuring
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    // create funcion create the value in the database -
    // it can work solo but we store the data in the new object so we can use it as a reference
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({success: true, order})

});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {

    // this will find the order by id then take the data of the user name and email 
    // and it will give us that instead of just the user id 
    // it will target the user field that have the user id and by targeting it it will take that users name and email and give us that back in response
    const order = await Order.findById(req.params.id).populate(
        "user", 
        "name email"
        );


    if(!order){
        return next(new ErrorHandler("Order Not Found with this Id", 404));
    }


    res.status(200).json({
        success:true,
        order,
    });

});


// Get Logged In User Order
exports.myOrder = catchAsyncErrors(async (req, res, next) => {

    // This will get the all the order done by the user
    // using the find because there could be many orders by one user
    const orders = await Order.find({user: req.user._id});


    res.status(200).json({
        success:true,
        orders,
    });

});





//Admin Routes

// Get All Orders - Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {

    // find all the orders done on the app
    const orders = await Order.find();


    let totalAmount = 0;

    // This is to show the total Amount of order on the website 
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success:true,
        orders,
    });

});


// Update Order Status - Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {

    // find the specific order in admin dashboard
    const order = await Order.findById(req.params.id);

    // running logic on the status of the order

    // if order not found
    if(!order){
        return next(new ErrorHandler("Order Not Found with this Id", 404));
    }


    // this is to check the order status
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You Have already delivered this order", 404));
    }

    // we need to decrease the quantity of the product in our stock as we create an order
    // and this will  be when the order is delivered not when its not been delivered -
    // because if someone place order and then cancel  the order then we don't have the product out of stock without  it ever being delivered
    // this is to fix the bug of lowering the stock when delivering -  only need to lower the stock when shipped
    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async(orderObj)=>{

            // this function will run and update the stock quantity of the product
            await updateStock(orderObj.product,orderObj.quantity);
        })
    }

    order.orderStatus = req.body.status;

    // this is  for the status we send of the order
    if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
        // order,
    });

});



// Function to update the stock
async function updateStock(id,quantity){
    const product  = await Product.findById(id);
    // the benefit of saving the reference is that you can access by its name in the different pages with just the use of the schema
    // reference helps us to get the specific related data of our schema linked , used or reference to our targeted requirement (usually id) 
    // in this case we find the product by the id that is saved in the different schema object and different collection of the database
    // thats the benefit of saving the reference in your schema model

    product.Stock-=quantity;

    await product.save({validateBeforeSave:false});

};



// Update Order Status - Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {

    // find the specific order in admin dashboard
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found with this Id", 404));
    }


    await order.deleteOne();

    res.status(200).json({
        success:true,
        // message:`the Order with Id: ${req.params.id} has been deleted`
    });

});