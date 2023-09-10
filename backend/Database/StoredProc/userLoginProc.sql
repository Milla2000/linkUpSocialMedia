CREATE OR ALTER PROCEDURE userLoginProc(@email VARCHAR(200))
AS
BEGIN
    SELECT * FROM usersTable WHERE email = @email
END