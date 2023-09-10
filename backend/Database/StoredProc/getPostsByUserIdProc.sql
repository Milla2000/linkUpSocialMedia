CREATE OR ALTER PROCEDURE getPostsByUserIdProc
    @userId VARCHAR(200)
AS
BEGIN
    SELECT *
    FROM postsTable
    WHERE user_id = @userId
      AND deleted_at IS NULL;
END