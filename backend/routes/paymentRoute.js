// this is our stripe payment method

const express = require("express");
const {processPayment, sendStripeApiKey} = require("../controllers/paymentController");
const router = express.Router();
const {isAuthenticatedUser} = require("../middleware/auth");

// this will be the route to the payment
router.route("/payment/process").post(isAuthenticatedUser, processPayment);

// this is to send the payment key to the frontend
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
