-- Edit User Procedure (editUserProc)
CREATE OR ALTER PROCEDURE editUserProc
    @id VARCHAR(200),
    @username VARCHAR(50),
    @email VARCHAR(100),
    @full_name VARCHAR(100),
    @profile_picture VARCHAR(255)
AS
BEGIN
    UPDATE usersTable
    SET
        username = @username,
        email = @email,
        full_name = @full_name,
        profile_picture = @profile_picture,
        updated_at = GETDATE()
    WHERE id = @id;
    
    IF @@ROWCOUNT > 0
    BEGIN
        SELECT 'User updated successfully' AS message;
    END
    ELSE
    BEGIN
        RAISERROR('User update failed', 16, 1);
    END
END;

-- -- Declare variables for parameters
-- DECLARE @id VARCHAR(200) = '36d7e3cd-49f4-4cb6-9171-a3f926fc7546'; -- Replace with an existing user ID
-- DECLARE @username VARCHAR(50) = 'millajesso';
-- DECLARE @email VARCHAR(100) = 'dennissplit203@gmail.com';
-- DECLARE @full_name VARCHAR(100) = 'milla789';
-- DECLARE @profile_picture VARCHAR(255) = '09c4447b-5d7a-4b3a-89d2-97f22886b405';

-- -- Execute the stored procedure
-- EXEC editUserProc @id, @username, @email, @full_name, @profile_picture;