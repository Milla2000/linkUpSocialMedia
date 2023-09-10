-- Create or Alter Procedure: getAllUsersProc
CREATE OR ALTER PROCEDURE getAllUsersProc
AS
BEGIN
    -- Select all active (non-deleted) users from the usersTable
    SELECT * FROM usersTable WHERE deleted_at IS NULL;
END;
