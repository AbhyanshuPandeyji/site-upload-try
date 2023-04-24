const express = require("express");
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUserProfile,
    deleteProfile
} = require("../controllers/userController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
const router = express.Router();


// to register a user - to sign up
router.route("/register").post(registerUser);


// to login a user - for sign in
router.route("/login").post(loginUser);


// route for Forgot password
router.route("/password/forgot").post(forgotPassword);

// reset password - token will be the parameter we provide
router.route("/password/reset/:token").put(resetPassword);


// to logout the user
router.route("/logout").get(logout);


// To get the User Details
router.route('/me').get(isAuthenticatedUser, getUserDetails);

// to update password
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

// update profile - it was me/update , but i can change it later
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

// delete account by the user itself
router.route('/me/delete/:id').delete( isAuthenticatedUser , deleteProfile);

// Admin Routes
// to get all users (admin)
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);

// to get a specific user (admin)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser);

// To update user role (admin)
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole);

// To Delete a User From the Websites Database (admin)
router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUserProfile);


module.exports = router;
