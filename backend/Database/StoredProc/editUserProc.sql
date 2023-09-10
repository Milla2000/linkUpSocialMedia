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
        profile_picture = @profile_picture
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