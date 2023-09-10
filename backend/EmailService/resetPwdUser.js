const ejs = require("ejs");
const mssql = require("mssql");
const bcrypt = require("bcrypt");
const { sendMail } = require("../Helpers/email");
const { sqlConfig } = require("../config/config");
const { v4 } = require("uuid");

// const { json } = require("express");



const resetPasswordController = {
    sendPasswordResetEmail: async (req , res) => {
        try {
            const { email } = req.body;
            const pool = await mssql.connect(sqlConfig);
             console.log("email", email);
            if (pool.connected) {
                // Generate a unique reset token using UUID
                const resetToken = v4(); // Use UUID library to generate a UUID

                const user = (
                    await pool
                        .request()
                        .input("email", email)
                        .query("SELECT id, username FROM usersTable WHERE email = @email")
                ).recordset[0];

                if (!user) {
                    console.log("User not found");
                    return res.status(404).json({ message: "User not found" });
                }

                ejs.renderFile(
                    "./Templates/resetPassword.ejs",
                    { resetToken, email },
                    async (err, html) => {
                        if (err) {
                            console.log("Error rendering email template:", err);
                            return res.status(500).json({ error: "Error rendering email template" });
                        }

                        const message = {
                            from: process.env.EMAIL_USER,
                            to: email,
                            subject: "Password Reset",
                            html,
                        };

                        try {
                            // Send password reset email
                            await sendMail(message);
                            console.log("Password reset email sent:", message);
                            res.status(200).json({
                                message: 'Password reset initiated. Check your email for instructions.',
                            });
                            // Update user's resetToken and resetTokenExpiry in the database
                            const resetTokenExpiry = new Date(Date.now() + 3600000); // One hour from now
                            await pool
                                .request()
                                .input("id", user.id)
                                .input("resetToken", resetToken)
                                .input("resetTokenExpiry", resetTokenExpiry)
                                .query(
                                    "UPDATE usersTable SET resetToken = @resetToken, resetTokenExpiry = @resetTokenExpiry WHERE id = @id"
                                );
                        } catch (error) {
                            console.log("Error sending email:", error);
                            return res.status(500).json({ error: "Error sending email" });
                        }
                    }
                );
            } else {
                console.log("Not connected to the database");
                return res.status(500).json({ error: "Database connection failed" });
            }
        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({ error: "An error occurred" });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { resetToken, newPassword } = req.body;

            const pool = await mssql.connect(sqlConfig);

            // Check if the reset token is still valid
            const user = await pool.request()
                .input("resetToken", resetToken)
                .query("SELECT id, resetTokenExpiry FROM usersTable WHERE resetToken = @resetToken");

            if (!user.recordset[0]) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const resetTokenExpiry = new Date(user.recordset[0].resetTokenExpiry);

            if (resetTokenExpiry <= new Date()) {
                return res.status(400).json({ error: "Token has expired" });
            }
            const hashedPwd = await bcrypt.hash(newPassword, 5);
            // Update user's password and resetToken related fields in the database
            await pool.request()
                .input("resetToken", resetToken)
                .input("newPassword", hashedPwd)
                .query(
                    "UPDATE usersTable SET password = @newPassword, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = @resetToken"
                );

            // Password reset successful
            res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({ message: "An error occurred" });
        }
    }
};


module.exports = resetPasswordController;
