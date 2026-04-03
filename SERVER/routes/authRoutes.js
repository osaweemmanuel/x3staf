const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/login").post(loginLimiter, authController.login);
router.route("/admin/login").post(loginLimiter, authController.adminLogin);
router.route("/customer/login").post(loginLimiter, authController.customerLogin);

router.route("/register").post(authController.register);

router.route("/refresh").get(authController.refresh);

const passport = require('passport');

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback", passport.authenticate('google', { session: false }), authController.GooglePassportCallback);

router.route("/verifyotp").post(authController.VerifyOTP);

router.route("/createnewotp").post(authController.createNewOTP);

router.route("/createnewlink").post(authController.createNewLink);

router.route("/logout").post(authController.logout);

router.route("/all").get(authController.getAllUsers);

router.route("/update").patch(authController.updateUser);

router.route("/delete").delete(authController.deleteUser);

router
  .route("/forgotpassword/sendotp")
  .post(authController.sendForgotPasswordOTP);

router
  .route("/forgotpassword/verifyotp")
  .post(authController.verifyForgotPasswordOTP);

router.route("/forgotpassword/reset").post(authController.resetPassword);

router.route("/verify-email").get(authController.verifyEmail);
module.exports = router;
