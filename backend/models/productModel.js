const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true, "Please Enter Product Name"
        ],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Description"]
    },
    price: {
        type: Number,
        required: [
            true, "Please Enter Product Price"
        ],
        maxLength: [8, "Price Cannot Exceed 8 Figures"]
    },
    // stars given - this is the overall review rating average of all users
    ratings: {
        type: Number,
        default: 0
    },
    // for multiple images
    images: [
        {

            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    // product in stock
    Stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [4, "Stock cannot exceed 4 Characters"],
        default: 1
    },
    // count no of reviews added
    numOfReviews: {
        type: Number,
        default: 0
    },
    // this is to add reviews to the product 
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            // this is the rating withing the review of the product 
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    // this is to check who created the product
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Product", productSchema);
