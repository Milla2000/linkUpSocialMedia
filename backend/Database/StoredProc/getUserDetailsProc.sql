CREATE OR ALTER PROCEDURE getUserDetailsProc
    @id VARCHAR(200)
AS
BEGIN
    -- Select a single user by ID from the usersTable
    SELECT * FROM usersTable WHERE id = @id;
END;
