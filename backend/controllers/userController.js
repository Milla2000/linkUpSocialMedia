const mssql = require("mssql");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { v4 } = require("uuid");
const { sqlConfig } = require("../config/config");
// const { registerSchema, loginSchema } = require("../validators/validators");
// const { createUsersTable } = require('../Database/Tables/createTables');
const dotenv = require("dotenv");
dotenv.config();






const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(req.params.id)
        const { username, email, full_name, profile_picture } = req.body;
       
        console.log(req.body)



        if (!username || !email || !full_name || !profile_picture) {
            return res.status(400).json({
                error: "Please input all values",
            });
        }

        const pool = await mssql.connect(sqlConfig);
        console.log("connected")

        const result = await pool
            .request()
            .input("id", mssql.VarChar, id)
            .input("username", mssql.VarChar, username)
            .input("email", mssql.VarChar, email)
            .input("full_name", mssql.VarChar, full_name)
            .input("profile_picture", mssql.VarChar, profile_picture)
            .execute("editUserProc");

        if (result.rowsAffected[0] === 1) {
            return res.json({ message: "User updated successfully" });
        } else {
            console.log("result.rowsAffected[0]" )
            return res.status(400).json({ message: "User update failed" });
        }
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: error.message });
    }
};

const softDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Please input user id",
            });
        }

        const pool = await mssql.connect(sqlConfig);
        console.log(id)
        const result = await pool
            .request()
            .input("id", mssql.VarChar, id)
            .execute("softDeleteUserProc");

        if (result.returnValue === 0) {
            return res.json({ message: "User soft-deleted successfully" });
        } else {
            return res.status(400).json({ message: "User deletion failed" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        // Execute the SQL procedure to retrieve all users
        const users = await pool
            .request()
            .execute("getAllUsersProc");

        // Return the list of users in the response
        return res.status(200).json(users.recordset);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAUserDetails = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming the user ID is passed as a parameter
         
       console.log(req.params.userId)

       if (!userId) {
            return res.status(400).json({
                error: "Please input user id",
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // Execute the SQL procedure to retrieve a single user by ID
        const user = await pool
            .request()
            .input("id", mssql.VarChar, userId)
            .execute("getUserDetailsProc");

        if (user.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user details in the response
        return res.status(200).json(user.recordset[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    editUser,
    softDeleteUser,
    getAllUsers,
    getAUserDetails
    
};
