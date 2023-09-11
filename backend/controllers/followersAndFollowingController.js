const mssql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { sqlConfig } = require("../config/config");
const { createUsersTable } = require('../Database/Tables/createTables'); // You can remove this import as createUsersTable is not needed here
const dotenv = require("dotenv");
dotenv.config();


const followUser = async (req, res) => {
    try {
        const { follower_id, following_id } = req.body;
        
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input("follower_id", mssql.VarChar, follower_id)
            .input("following_id", mssql.VarChar, following_id)
            .execute("followUserProc");

        const resultCode = result.returnValue;
        if (resultCode === 0) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        } else if (resultCode === 1) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        return res.status(200).json({ message: 'You are now following this user' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const { follower_id, following_id } = req.body;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input("follower_id", mssql.VarChar, follower_id)
            .input("following_id", mssql.VarChar, following_id)
            .execute("unfollowUserProc");

        const resultCode = result.returnValue;
        if (resultCode === 0) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        return res.status(200).json({ message: 'You have unfollowed this user' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const getUserFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const pool = await mssql.connect(sqlConfig);

        // Fetch the list of followers for the specified user
        const result = await pool
            .request()
            .input("userId", mssql.VarChar, userId)
            .execute("getUserFollowersProc");

        if (result.recordset.length > 0) {
            // Initialize an array to store follower details
            const followers = [];

            // Iterate through the follower records
            for (const follower of result.recordset) {
                // Fetch follower details from the users table using getUserDetailsByIdProc
                const followerDetailsResult = await pool
                    .request()
                    .input("userId", mssql.VarChar, follower.follower_id)
                    .execute("getUserDetailsByIdProc");

                // Check if follower details were found
                if (followerDetailsResult.recordset.length > 0) {
                    // Include follower details in the response
                    followers.push(followerDetailsResult.recordset[0]);
                }
            }

            return res.status(200).json(followers);
        } else {
            return res.status(404).json({ error: "No followers found for this user." });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const getUserFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input("userId", mssql.VarChar, userId)
            .execute("getUserFollowingProc");

        if (result.recordset.length > 0) {
            // Initialize an array to store followed user details
            const following = [];

            // Iterate through the followed user records
            for (const followedUser of result.recordset) {
                // Fetch followed user details from the users table
                const followedUserDetails = await pool
                    .request()
                    .input("userId", mssql.VarChar, followedUser.following_id)
                    .execute("getUserDetailsByIdProc");

                // Check if followed user details were found
                if (followedUserDetails.recordset.length > 0) {
                    // Include followed user details in the response
                    following.push(followedUserDetails.recordset[0]);
                }
            }

            return res.status(200).json(following);
        } else {
            return res.status(404).json({ error: "This user is not following anyone." });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



module.exports = {
    unfollowUser,
    followUser,
    getUserFollowers,
    getUserFollowing
    
};