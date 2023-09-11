CREATE OR ALTER PROCEDURE getUserDetailsByIdProc
    @userId VARCHAR(200)
AS
BEGIN
    -- Fetch user details by user ID
    SELECT * FROM usersTable WHERE id = @userId;
END;
