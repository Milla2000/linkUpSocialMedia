 CREATE OR ALTER  PROCEDURE editUserProc
    @id VARCHAR(255),
    @username VARCHAR(255),
    @email VARCHAR(255),
    @full_name VARCHAR(255),
    @profile_picture VARCHAR(255)
AS
BEGIN
    -- Check if the new email already exists for another user
    IF EXISTS (SELECT 1 FROM usersTable WHERE email = @email AND id != @id)
    BEGIN
        -- Email already exists, return an error
        SELECT -1 AS result;
        RETURN;
    END

    -- Check if the new username already exists for another user
    IF EXISTS (SELECT 1 FROM usersTable WHERE username = @username AND id != @id)
    BEGIN
        -- Username already exists, return an error
        SELECT -2 AS result;
        RETURN;
    END

    -- Perform the user update if email and username are unique
    UPDATE usersTable
    SET username = @username,
        email = @email,
        full_name = @full_name,
        profile_picture = @profile_picture
    WHERE id = @id;

    IF @@ROWCOUNT = 1
    BEGIN
        -- User updated successfully
        SELECT 1 AS result;
        RETURN;
    END
    ELSE
    BEGIN
        -- User update failed
        SELECT 0 AS result;
        RETURN;
    END
END

-- -- Declare variables for parameters
-- DECLARE @id VARCHAR(200) = '36d7e3cd-49f4-4cb6-9171-a3f926fc7546'; -- Replace with an existing user ID
-- DECLARE @username VARCHAR(50) = 'millajesso';
-- DECLARE @email VARCHAR(100) = 'dennissplit203@gmail.com';
-- DECLARE @full_name VARCHAR(100) = 'milla789';
-- DECLARE @profile_picture VARCHAR(255) = '09c4447b-5d7a-4b3a-89d2-97f22886b405';

-- -- Execute the stored procedure
-- EXEC editUserProc @id, @username, @email, @full_name, @profile_picture;