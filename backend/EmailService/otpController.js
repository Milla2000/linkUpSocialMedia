// const mssql = require("mssql");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { sendMail } = require("../Helpers/email");
// const { sqlConfig } = require("../config/config");

// // Generate a random 6-digit OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send OTP to the user (You can implement your preferred method here)
// const sendOTP = async (email, otp) => {
//     // Implement sending OTP to the user via email or SMS
//     // For example, you can send it via email using nodemailer
//     // Make sure to store the OTP and its expiry timestamp in the user's record in the database
//     // You can also send the OTP via SMS using a third-party service
//     // Ensure you have a way to validate the OTP entered by the user
//     const message = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "One-Time Password (OTP)",
//         text: `Your OTP is: ${otp}`,
//     };

//     try {
//         // Send OTP via email
//         await sendMail(message);
//         console.log("OTP sent:", message);
//     } catch (error) {
//         console.log("Error sending OTP:", error);
//         throw new Error("Error sending OTP");
//     }
// };

// const otpController = {
//     generateAndSendOTP: async (req, res) => {
//         try {
//             // const email = req.params.userEmail;
//             const { email } = req.params;

//             // if (!email) {
//             //     return res.status(400).json({
//             //         error: "Please provide an email address",
//             //     });
//             // }

//             const pool = await mssql.connect(sqlConfig);

//             // Check if the email exists in the system
//             const user = (
//                 await pool
//                     .request()
//                     .input("email", mssql.VarChar, email)
//                     .execute("userLoginProc")
//             ).recordset[0];

//             if (!user) {
//                 return res.status(404).json({ message: "Email does not exist in the system. Please use a valid email address." });
//             }

//             // Generate a new OTP
//             const otp = generateOTP();

//             // Send the OTP to the user
//             await sendOTP(email, otp);

//             // Store the OTP and its expiry timestamp in the user's record in the database
//             const otpExpiry = new Date(Date.now() + 600000); // OTP expires in 10 minutes
//             await pool
//                 .request()
//                 .input("email", email)
//                 .input("otp", otp)
//                 .input("otpExpiry", otpExpiry)
//                 .query("UPDATE usersTable SET otp = @otp, otpExpiry = @otpExpiry WHERE email = @email");

//             return res.status(200).json({ message: "OTP sent successfully" });

//         } catch (error) {
//             return res.status(500).json({ error: error.message });
//         }
//     },

//     verifyOTP: async (req, res) => {
//         try {
//             const { UserEmail } = req.params; // Extract email from URL params
//             const { otp } = req.body; // Extract OTP from request body

//             if (!otp) {
//                 return res.status(400).json({
//                     error: "Please provide OTP",
//                 });
//             }

//             const pool = await mssql.connect(sqlConfig);

//             // Retrieve the user by email
//             const user = (
//                 await pool
//                     .request()
//                     .input("email", mssql.VarChar, UserEmail)
//                     .execute("getUserOTPProc")
//             ).recordset[0];

//             if (!user || user.otp !== otp) {
//                 return res.status(401).json({ message: "Incorrect OTP or OTP has expired. Please request a new OTP." });
//             }

//             // Check if OTP is expired
//             const otpExpiry = new Date(user.otpExpiry);
//             if (otpExpiry <= new Date()) {
//                 return res.status(401).json({ message: "OTP has expired. Please request a new OTP." });
//             }

//             // If OTP is correct and not expired, generate a JWT token
//             const { id, ...payload } = user;
//             const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "360000s" });
//             let message = "OTP verified";

//             // Set the OTP and OTP Expiry columns to null
//             await pool
//                 .request()
//                 .input("email", mssql.VarChar, UserEmail)
//                 .execute("UpdateOTPAndExpiryProc");

//             return res.status(200).json({ id, message, token });

//         } catch (error) {
//             return res.status(500).json({ error: error.message });
//         }
//     },
// };

// module.exports = otpController;
