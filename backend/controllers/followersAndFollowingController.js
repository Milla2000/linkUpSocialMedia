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

        const result = await pool
            .request()
            .input("userId", mssql.VarChar, userId)
            .execute("getUserFollowersProc");

        if (result.recordset.length > 0) {
            const followers = result.recordset.map((follower) => ({
                user_id: follower.follower_id,
                // Include other follower information as needed
            }));
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
            const following = result.recordset.map((followedUser) => ({
                user_id: followedUser.following_id,
                // Include other followed user information as needed
            }));
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