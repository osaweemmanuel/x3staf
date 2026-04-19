const User = require("../models/User");
const Notification = require("../models/Notification");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { OAuth2Client } = require("google-auth-library");
const {
  sendVerificationEmail,
  hashPassword,
  comparePassword,
  sendOTPEmail,
  generateRandomToken,
} = require("../helpers/auth");
require("dotenv").config();

// Google OAuth Config
const oauth2Client = new OAuth2Client(
  process.env.GO_CLIENT_ID,
  process.env.GO_CLIENT_SECRET,
  process.env.GO_REDIRECT_URI
);

// @desc Register
// @route POST /auth
// @access Public
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name) {
      console.log(`Name required for ${email}`);
      return res.json({
        error: "Name is Required",
      });
    }
    if (!password || password.length < 10) {
      console.log(`Password required or below 10 characters: ${email}`);
      return res.json({
        error: "Password is Required and should be at least 10 characters long",
      });
    }
    const exist = await User.findOne({ where: { email } });
    if (exist) {
      console.log(`User with email ${email} already exists`);
      return res.json({
        error: "Email is already taken",
      });
    }

    const hashedpassword = await hashPassword(password);

    const user = await User.create({
      username: name,
      email: email,
      password: hashedpassword,
    });

    const newOTP = generateRandomToken();

    const token = await Token.create({
      email: user.email,
      token: newOTP,
      purpose: "email",
    });

    await sendVerificationEmail(user.email, newOTP);

    // 🛡️ Create System Notification for welcoming the new user
    await Notification.create({
      userId: user.id,
      message: `Welcome to X3 Staffing, ${user.username || 'Personnel'}! Your identity registry has been successfully initialized. Please complete your profile to start applying for jobs.`,
      type: 'WELCOME'
    });

    console.log("Token and User created:", { token: token.token, userId: user.id });
    return res.status(200).json({
      status: 200,
      message: "Registered Successfully. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      error: "An error occurred during registration. Email dispatch failed.",
      details: error.message, // This will show you exactly what is wrong (e.g. "Bad Credentials" or "Timeout")
    });
  }
};

// @desc Login
// @route POST /auth
// @access Public
const genericLogin = async (req, res, requiredRole = null) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const foundUser = await User.findOne({ where: { email } });

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ error: "You are not registered" });
  }

  if (requiredRole && !foundUser.roles.includes(requiredRole)) {
    return res.status(403).json({ error: `Unauthorized: ${requiredRole} access only` });
  }

  if (!foundUser.verified) {
    try {
      const existingToken = await Token.findOne({ where: { email, purpose: "email" } });
      const newOTP = generateRandomToken();
      if (existingToken) {
        existingToken.token = newOTP;
        await existingToken.save();
      } else {
        await Token.create({ email, token: newOTP, purpose: "email" });
      }
      await sendVerificationEmail(email, newOTP);
    } catch (err) {
      console.error("Background verification sync failed:", err);
    }
    return res.status(402).json({ error: "Personnel registry not verified. A new verification handshake has been dispatched to your email." });
  }

  const PasswordsMatch = await comparePassword(password, foundUser.password);

  if (!PasswordsMatch) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        userId: foundUser.id,
        verified: foundUser.verified,
        email: foundUser.email,
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" } // Extended for better UX
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true, // Now required for cross-domain cookies
    sameSite: "None", // Required for cPanel-to-DigitalOcean communication
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

const login = (req, res) => genericLogin(req, res);
const adminLogin = (req, res) => genericLogin(req, res, "Admin");
const customerLogin = (req, res) => genericLogin(req, res, "User");






const GooglePassportCallback = async (req, res) => {
  try {
    const user = req.user; // Passport attaches the profile to req.user

    // Generate access and refresh tokens for session management
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: user.id,
          verified: user.verified,
          email: user.email,
          username: user.username,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set the refresh token in a secure cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to dashboard after successful login
    res.redirect(`${process.env.LIVE_URL || 'http://localhost:5173'}/userdashboard`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Handshake Error with Google" });
  }
};









// Function to read the HTML file
const readHtmlFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};



// @desc Verify Email using LINK
// @route GET /auth/verifyemail
// const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     // Find the token in the database
//     const tokenDoc = await Token.findOne({ token, purpose: "email" }).exec();

//     if (!tokenDoc) {
//       console.log("Invalid or expired verification token");
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired verification token" });
//     }

//     // Check if the token has expired
//     if (tokenDoc.expiresAt <= new Date()) {
//       // Token has expired
//       await tokenDoc.deleteOne(); // Remove the expired token
//       console.log("Verification token has expired");
//       return res
//         .status(400)
//         .json({ message: "Verification token has expired" });
//     }

//     // Update the user to 'verified: true'
//     const updatedUser = await User.findOneAndUpdate(
//       { email: tokenDoc.email },
//       { verified: true },
//       { new: true }
//     ).exec();

//     // Remove the token as it's no longer needed
//     await tokenDoc.deleteOne();

//     // Read the HTML file
//     const htmlFilePath = path.join(__dirname, "../views/VerifiedEmail.html");
//     const htmlContent = await readHtmlFile(htmlFilePath);

//     // Replace placeholders in the HTML content
//     const finalHtml = htmlContent.replace("{USER_EMAIL}", updatedUser.email);

//     // Send the HTML file as a response
//     res.send(finalHtml);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// };


const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Find the token in the database
    const tokenDoc = await Token.findOne({ where: { token, purpose: "email" } });
 console.log(tokenDoc,"trying to get email");
    if (!tokenDoc) {
      console.log("Invalid or expired verification token");
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Check if the token has expired
    if (tokenDoc.expiresAt < new Date()) {
      await tokenDoc.destroy(); // Remove the expired token
      console.log("Verification token has expired");
      return res.status(400).json({ message: "Verification token has expired" });
    }

    // Update the user to 'verified: true'
    const updatedUser = await User.update(
      { verified: true },
      { where: { email: tokenDoc.email }, returning: true }
    );
    console.log("User found before update:", updatedUser);
    if (!updatedUser) {
      console.log("User update failed or user not found");
      return res.status(400).json({ message: "User update failed" });
    }
    // Remove the token as it's no longer needed
    await tokenDoc.destroy();

    // Read the HTML file
    const htmlFilePath = path.resolve(__dirname, "../views/VerifiedEmail.html");
    const htmlContent = await readHtmlFile(htmlFilePath);

    // Replace placeholders in the HTML content
    const finalHtml = htmlContent.replace("{USER_EMAIL}", updatedUser.email);

    // Send the HTML file as a response
    res.send(finalHtml);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// @desc Verify Email using OTP
// @route POST /auth/verifyotp
const VerifyOTP = async (req, res) => {
  const { email, OTP } = req.body;

  try {
    // Find the token associated with the user's email and purpose
    const token = await Token.findOne({ where: { email, purpose: "email" } });

    if (!token) {
      // Token not found
      console.log("Token not found");
      return res
        .status(404)
        .json({ message: "Token not found", success: false });
    }

    // Check if the user is already verified
    const user = await User.findOne({ where: { email, verified: true } });
    if (user) {
      console.log("User is already verified");
      return res
        .status(200)
        .json({ message: "User is already verified", success: true, user });
    }

    // Check if the token has expired
    if (token.expiresAt <= new Date()) {
      // Token has expired
      await token.destroy(); // Remove the expired token
      console.log("Token has expired");
      return res
        .status(401)
        .json({ message: "Token has expired", success: false });
    }

    // Check if the provided OTP matches the token's OTP
    if (token.token !== OTP) {
      // Incorrect OTP
      console.log("Incorrect OTP");
      return res.status(401).json({ message: "Incorrect OTP", success: false });
    }

    // Update the user to 'verified: true'
    const [updatedCount] = await User.update(
      { verified: true },
      { where: { email } }
    );
    const updatedUser = await User.findOne({ where: { email } });

    // Remove the token as it's no longer needed
    await token.destroy();

    // Respond with success message and updated user
    console.log(`Email ${email} has been verified`);
    return res.status(200).json({
      message: "Email verification successful",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// @desc Create New Email Verification Link
// @route POST /auth/createnewlink
const createNewLink = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if there is an existing token with the user's email
    const existingToken = await Token.findOne({ where: { email } });

    if (existingToken) {
      // Update the existing token with a new OTP
      const newOTP = generateRandomToken();
      existingToken.token = newOTP;
      await existingToken.save();
      await sendVerificationEmail(existingToken.email, newOTP);
      console.log(existingToken);
      return res.status(200).json({ message: "Link updated successfully" });
    } else {
      // Create a new OTP
      const newOTP = generateRandomToken();

      // Create a new token with the userId and the new OTP
      const newToken = await Token.create({
        email: email,
        token: newOTP,
        purpose: "email",
      });

      // Send OTP email to the user
      await sendVerificationEmail(email, newOTP);
      console.log(newToken);
      return res
        .status(200)
        .json({ message: "New Email Verification Link created successfully" });
    }
  } catch (error) {
    console.error("Error creating new OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc Create New OTP
// @route POST /auth/createnewotp
const createNewOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if there is an existing token with the user's email
    const existingToken = await Token.findOne({ where: { email } });

    if (existingToken) {
      // Update the existing token with a new OTP
      const newOTP = generateRandomToken();
      existingToken.token = newOTP;
      await existingToken.save();
      await sendOTPEmail(existingToken.email, newOTP);
      console.log(existingToken);
      return res
        .status(200)
        .json({ message: "OTP updated successfully", newOTP });
    } else {
      // Create a new OTP
      const newOTP = generateRandomToken();

      // Create a new token with the userId and the new OTP
      const newToken = await Token.create({
        email: email,
        token: newOTP,
        purpose: "email",
      });

      // Send OTP email to the user
      await sendOTPEmail(email, newOTP);
      console.log(newToken);
      return res
        .status(200)
        .json({ message: "New OTP created successfully", newOTP });
    }
  } catch (error) {
    console.error("Error creating new OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc Send OTP for password reset
// @route POST /auth/forgotpassword/sendotp
// @access Public
const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });

    if (!user || !user.active) {
      console.log(`User not found with ${email} email`);
      return res.status(401).json({ error: "User not found", success: false });
    }

    // Check if there is an existing token with the user's email and purpose 'forgotpassword'
    const existingToken = await Token.findOne({
      where: { email, purpose: "forgotpassword" },
    });

    if (existingToken) {
      // Update the existing token with a new OTP
      const newOTP = generateRandomToken();
      existingToken.token = newOTP;
      await existingToken.save();
      await sendOTPEmail(existingToken.email, newOTP);
      console.log(existingToken);
      return res
        .status(200)
        .json({ message: "OTP updated successfully", success: true });
    } else {
      // Create a new OTP
      const newOTP = generateRandomToken();

      // Create a new token with the email, the new OTP, and purpose 'forgotpassword'
      const newToken = await Token.create({
        email: email,
        token: newOTP,
        purpose: "forgotpassword",
      });

      // Send OTP email to the user
      await sendOTPEmail(email, newOTP);
      console.log(newToken);
      return res
        .status(200)
        .json({ message: "OTP sent successfully", success: true });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    console.error(error.stack); // Log the stack trace
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// @desc Verify OTP for password reset
// @route POST /auth/forgotpassword/verifyotp
// @access Public
const verifyForgotPasswordOTP = async (req, res) => {
  const { email, OTP } = req.body;

  try {
    // Find the token associated with the user's email and purpose 'forgotpassword'
    const token = await Token.findOne({
      email,
      purpose: "forgotpassword",
    }).exec();

    if (!token) {
      // Token not found
      console.log("Token not found");
      return res
        .status(404)
        .json({ message: "Token not found", success: false });
    }

    // Check if the token has expired
    if (token.expiresAt <= new Date()) {
      // Token has expired
      await token.destroy(); // Remove the expired token
      console.log("Token has expired");
      return res
        .status(401)
        .json({ message: "Token has expired", success: false });
    }

    // Check if the provided OTP matches the token's OTP
    if (token.token !== OTP) {
      // Incorrect OTP
      console.log("Incorrect OTP");
      return res.status(401).json({ message: "Incorrect OTP", success: false });
    }

    // Respond with success message
    console.log(`OTP for password reset verified`);
    res
      .status(200)
      .json({ message: "OTP verification successful", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// @desc Reset password
// @route POST /auth/forgotpassword/reset
// @access Public
const resetPassword = async (req, res) => {
  const { email, OTP, password } = req.body;

  try {
    // Find the token associated with the user's email and purpose 'forgotpassword'
    const token = await Token.findOne({
      email,
      purpose: "forgotpassword",
    }).exec();

    if (!token) {
      // Token not found
      console.log("Token not found");
      return res
        .status(404)
        .json({ message: "Token not found", success: false });
    }

    // Check if the token has expired
    if (token.expiresAt <= new Date()) {
      // Token has expired
      await token.destroy(); // Remove the expired token
      console.log("Token has expired");
      return res
        .status(401)
        .json({ message: "Token has expired", success: false });
    }

    // Check if the provided OTP matches the token's OTP
    if (token.token !== OTP) {
      // Incorrect OTP
      console.log("Incorrect OTP");
      return res.status(401).json({ message: "Incorrect OTP", success: false });
    }

    // Update the user's password
    const hashedPassword = await hashPassword(password);
    await User.update(
      { password: hashedPassword },
      { where: { email } }
    );

    // Remove the token as it's no longer needed
    await token.destroy();

    // Respond with success message
    console.log(`Password reset successful`);
    res
      .status(200)
      .json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        where: { username: decoded.username },
      });

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
            verified: foundUser.verified,
            email: foundUser.email,
            userId: foundUser.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the user exist to update?
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ where: { username } });

  // Allow updates to the original user
  if (duplicate && duplicate?.id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await hashPassword(password);
  }

  const updatedUser = await user.save();

  res.json({ message: updatedUser.username + " " + "updated" });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  await user.destroy();

  const reply = `Username ${user.username} with ID ${user.id} deleted`;

  res.json(reply);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  adminLogin,
  customerLogin,
  verifyEmail,
  GooglePassportCallback,
  refresh,
  createNewOTP,
  VerifyOTP,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  createNewLink,
  register,
  logout,
  updateUser,
  deleteUser,
  getAllUsers,
};
