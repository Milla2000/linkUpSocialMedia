CREATE OR ALTER PROCEDURE getAllPostsProc
AS
BEGIN
    SELECT *
    FROM postsTable
    WHERE deleted_at IS NULL; -- Add WHERE clause to filter out soft-deleted posts
END;
