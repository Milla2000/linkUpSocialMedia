const mssql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sqlConfig } = require("../config/config");
const { v4 } = require("uuid");
const { createUsersTable } = require('../Database/Tables/createTables'); // You can remove this import as createUsersTable is not needed here
const dotenv = require("dotenv");
dotenv.config();
// Controller for toggling like/unlike on a comment
const toggleLikeUnlikeComment = async (req, res) => {
    try {
        const id = v4();
        const { user_id, comment_id } = req.body;

        const pool = await mssql.connect(sqlConfig);

        // Execute the ToggleLikeUnlikeCommentProc procedure
        const result = await pool
            .request()
            .input("id", mssql.VarChar, id)
            .input("user_id", mssql.VarChar, user_id)
            .input("comment_id", mssql.VarChar, comment_id)
            .execute("toggleLikeUnlikeCommentProc");

        // Check the result returned by the procedure
        if (result.returnValue === 0) {
            return res.status(200).json({ message: 'Comment unliked successfully' });
        } else if (result.returnValue === 1) {
            return res.status(200).json({ message: 'Comment liked successfully' });
        } else {
            return res.status(500).json({ error: 'An error occurred while toggling like/unlike' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const toggleLikeUnlikePost = async (req, res) => {
    try {
        const { user_id, post_id } = req.body;
        const id = v4(); // Generate a unique id for each like or unlike action

        const pool = await mssql.connect(sqlConfig);

        // Execute the ToggleLikeUnlikePostProc procedure
        const result = await pool
            .request()
            .input("id", mssql.VarChar, id)
            .input("user_id", mssql.VarChar, user_id)
            .input("post_id", mssql.VarChar, post_id)
            .execute("toggleLikeUnlikePostProc");

        // Check the result to determine if it was a like or unlike
        if (result.returnValue === 1) {
            return res.status(200).json({ message: "Post liked" });
        } else if (result.returnValue === 0) {
            return res.status(200).json({ message: "Post unliked" });
        } else {
            return res.status(400).json({ message: "Toggle like/unlike failed" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    toggleLikeUnlikeComment,
    toggleLikeUnlikePost
};
