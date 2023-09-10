CREATE OR ALTER PROCEDURE deleteUserProc
    @id VARCHAR(200)
AS
BEGIN
    DELETE FROM usersTable
    WHERE id = @id;
END;