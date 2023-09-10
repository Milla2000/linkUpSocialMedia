CREATE OR ALTER PROCEDURE fetchOneUserProc (@id VARCHAR(200))
AS  
    BEGIN 
        SELECT * FROM usersTable  WHERE id = @id
    END