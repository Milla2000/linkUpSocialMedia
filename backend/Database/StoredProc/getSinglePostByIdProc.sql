CREATE OR ALTER PROCEDURE getSinglePostByIdProc
    @postId VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM postsTable
    WHERE id = @postId;
END;
