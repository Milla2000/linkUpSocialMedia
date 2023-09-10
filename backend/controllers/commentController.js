const mssql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { sqlConfig } = require("../config/config");
// const { createUsersTable } = require('../Database/Tables/createTables'); // You can remove this import as createUsersTable is not needed here
const dotenv = require("dotenv");
dotenv.config();


// Function to create a comment
const createComment = async (req, res) => {
    try {
        const { postId, userId, content, parentCommentId } = req.body;

        if (!postId || !userId || !content) {
            return res.status(400).json({ error: 'Please provide postId, userId, and content' });
        }

        const pool = await mssql.connect(sqlConfig);

        // Generate a unique ID for the comment
        const commentId = v4();

        // Create the comment using the stored procedure
        const result = await pool
            .request()
            .input('id', mssql.VarChar, commentId)
            .input('post_id', mssql.VarChar, postId)
            .input('user_id', mssql.VarChar, userId)
            .input('content', mssql.Text, content)
            .input('parent_comment_id', mssql.VarChar, parentCommentId || null) // Nullable for replies
            .execute('insertCommentProc'); // Use the correct procedure name

        if (result.rowsAffected[0] === 1) {
            return res.json({ message: 'Comment created successfully' });
        } else {
            return res.status(400).json({ message: 'Comment creation failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Function to get comments for a post or a comment
const getComments = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const pool = await mssql.connect(sqlConfig);

        let procedure;
        let params;

        if (postId) {
            // If postId is provided, call the procedure to fetch comments for a post
            procedure = 'getCommentsForPostProc';
            params = { postId };
        } else if (commentId) {
            // If commentId is provided, call the procedure to fetch sub-comments for a comment
            procedure = 'getSubCommentsForCommentProc';
            params = { commentId };
        } else {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const result = await pool
            .request()
            .input('Id', mssql.VarChar, postId || commentId) // Pass either postId or commentId
            .execute(procedure);

        if (result.recordset.length > 0) {
            return res.json(result.recordset);
        } else {
            return res.status(404).json({ error: 'No comments found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};




const editComment = async (req, res) => {
    try {
        const { comment_id, user_id, newContent } = req.body;

        const pool = await mssql.connect(sqlConfig);

        // Check if the user is the author of the comment using a stored procedure
        const result = await pool
            .request()
            .input("comment_id", mssql.VarChar, comment_id)
            .input("user_id", mssql.VarChar, user_id)
            .input("newContent", mssql.Text, newContent)
            .execute("editCommentProc");

        if (result.returnValue === 0) {
            // The comment was successfully edited
            return res.status(200).json({ message: "Comment updated successfully" });
        } else if (result.returnValue === 1) {
            // User is not authorized to edit the comment
            return res.status(403).json({ message: "You are not authorized to edit this comment" });
        } else {
            // An error occurred during the update
            return res.status(500).json({ error: "Failed to update comment" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const softDeleteComment = async (req, res) => {
    try {
        const { comment_id, user_id } = req.body;

        if (!comment_id || !user_id) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const result = await pool
            .request()
            .input("comment_id", mssql.VarChar, comment_id)
            .input("userId", mssql.VarChar, user_id)
            .execute("SoftDeleteCommentProc");

        if (result.returnValue === 0) {
            // Comment not found, already deleted, or unauthorized
            return res.status(404).json({ error: 'Comment not found, already deleted, or you are not the owner' });
        } else if (result.returnValue === 1) {
            // Successful deletion
            return res.json({ message: 'Comment soft deleted successfully' });
        } else {
            // Other error occurred
            return res.status(500).json({ error: 'An error occurred while trying to delete the comment' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};




module.exports = {
    getComments,
    createComment,
    editComment,
    softDeleteComment
};

