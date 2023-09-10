CREATE OR ALTER PROCEDURE getCommentsForPostProc
    @postId VARCHAR(200)
AS
BEGIN
    -- Fetch comments for a post
    SELECT *
    FROM comments
    WHERE post_id = @postId
      AND deleted_at IS NULL;
END;
