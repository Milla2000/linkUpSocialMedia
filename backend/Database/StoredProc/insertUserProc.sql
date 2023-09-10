CREATE OR ALTER PROCEDURE InsertUserProc
    @id VARCHAR(200),
    @username VARCHAR(200),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @full_name VARCHAR(100), -- Add this parameter for user's full name
    @profile_picture VARCHAR(255), -- Add this parameter for user's profile picture URL/file path-- Set created_at with GETDATE() -- Set updated_at with GETDATE()
    @resetToken VARCHAR(200) = NULL,
    @resetTokenExpiry DATETIME = NULL,
    @otp VARCHAR(6)= NULL, -- Add OTP column (6 characters)
    @otpExpiry DATETIME = NULL, -- Add OTP expiry timestamp
    @deleted_at DATETIME = NULL,
    @followers_count INT = 0,
    @following_count INT = 0
AS
BEGIN
    INSERT INTO usersTable (id, username, email, password, full_name, profile_picture, resetToken, resetTokenExpiry, otp, otpExpiry, deleted_at, followers_count, following_count)
    VALUES (@id, @username, @email, @password, @full_name, @profile_picture, @resetToken, @resetTokenExpiry, @otp, @otpExpiry, @deleted_at, @followers_count, @following_count);
END;
