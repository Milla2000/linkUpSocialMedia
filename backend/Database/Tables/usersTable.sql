BEGIN TRY
    CREATE TABLE usersTable (
    id VARCHAR(200) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    profile_picture VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME,
    resetToken VARCHAR(200),
    resetTokenExpiry DATETIME,
    otp VARCHAR(6), -- Add OTP column (6 characters)
    otpExpiry DATETIME, -- Add OTP expiry timestamp
    deleted_at DATETIME,
    followers_count INT DEFAULT 0, -- Count of followers
    following_count INT DEFAULT 0 -- Count of following
);
END TRY
BEGIN CATCH
    THROW 50001, 'Table already exists!', 1;
END CATCH;


DROP TABLE IF EXISTS usersTable;

-- // fetch everything from this TABLE
SELECT * FROM usersTable;

DELETE FROM usersTable;


UPDATE usersTable
SET deleted_at = NULL
WHERE id = '01436d12-3006-4c7d-85ad-aa12f466e932';

