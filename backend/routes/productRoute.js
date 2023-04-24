const express = require('express');
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteProductReview,
    getAdminProducts
} = require('../controllers/productController.js');
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth.js');

const router = express.Router();



// To get all Products
router.route('/products').get(getAllProducts);

// To get product Details
router.route('/product/:id').get(getProductDetails);

// To get the Reviews Or Update the review
router.route("/review").put(isAuthenticatedUser, createProductReview);

// To Get All Reviews on The Product - no need to login because you wont have to login to see the - anyone can see the review
router.route("/reviews").get(getProductReviews);

//to Delete A Review On A Product
router.route("/reviews").delete(isAuthenticatedUser, deleteProductReview );


// Admin Routes
// to get all products - for admin without  any filter
router.route('/admin/products').get(isAuthenticatedUser , authorizeRoles("admin") , getAdminProducts);


// TO create Product - it will require the auth and the admin route
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// To Update a Product
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);


// To delete A Product
router.route("/admin/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);



module.exports = router;
