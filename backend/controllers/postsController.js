const mssql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { sqlConfig } = require("../config/config");
const { createUsersTable } = require('../Database/Tables/createTables'); // You can remove this import as createUsersTable is not needed here
const dotenv = require("dotenv");
dotenv.config();




const  createNewPost = async (req, res) => {
    try { 
        
        const id = v4();
        const { user_id, content, image_url } = req.body;
        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input('id', mssql.VarChar, id)
            .input('user_id', mssql.VarChar, user_id)
            .input('content', mssql.Text, content)
            .input('image_url', mssql.VarChar, image_url)
            .execute('createPostProc');

        if (result.rowsAffected[0] === 1) {
            return res.json({
                message: 'Post created successfully',
            });
        } else {
            return res.json({ message: 'Post creation failed' });
        }
    } catch (error) {
        return res.json({ error: error.message });
    }
};

const editPost = async (req, res) => {
    try {
        const { post_id, user_id, newContent, image_url } = req.body;
        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input('post_id', mssql.VarChar, post_id)
            .input('user_id', mssql.VarChar, user_id)
            .input('newContent', mssql.Text, newContent)
            .input('image_url', mssql.VarChar, image_url)
            .execute('editPostProc');

        if (result.recordset.length > 0) {
            return res.json({ message: result.recordset[0].message });
        } else {
            return res.status(403).json({ message: 'You are not authorized to edit this post' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const deletePostId = async (req, res) => {
    try {
        const { user_id, post_id } = req.body;

        if (!user_id || !post_id) {
            return res.status(400).json({
                error: 'Please provide user_id and post_id',
            });
        }

        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input('user_id', mssql.VarChar, user_id)
            .input('post_id', mssql.VarChar, post_id)
            .execute('deletePostProc');

        if (result.returnValue === 0) {
            return res.json({ message: 'Post deleted successfully' });
        } else if (result.returnValue === 1) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        } else {
            return res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//get all posts from all users
const getAllPosts = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .execute('getAllPostsProc');

        if (result.recordset.length > 0) {
            return res.json(result.recordset);
        } else {
            return res.status(404).json({ error: 'No posts found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



//get all posts by user id
const getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming you pass the user ID as a URL parameter

        const pool = await mssql.connect(sqlConfig);

        // Replace 'posts' with the actual name of your 'posts' table
        const result = await pool
            .request()
            .input("userId", mssql.VarChar, userId)
            .execute("getPostsByUserIdProc"); // Call the stored procedure

        // Check if there are posts for the specified user
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        // Return the posts as JSON
        return res.status(200).json(result.recordset);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//get a single post by post id
const viewPostById = async (req, res) => {
    try {
        const { postId } = req.params; // Assuming the post ID is passed as a URL parameter
         console.log(postId)
        const pool = await mssql.connect(sqlConfig);

        // Replace 'posts' with the actual name of your 'posts' table
        const result = await pool
            .request()
            .input("postId", mssql.VarChar, postId)
            .execute("getSinglePostByIdProc"); // Call the stored procedure to retrieve a single post by ID

        // Check if the post exists
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Return the post as JSON
        return res.status(200).json(result.recordset[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createNewPost,
    editPost,
    deletePostId,
    getAllPosts,
    getPostsByUserId,
    viewPostById
};


