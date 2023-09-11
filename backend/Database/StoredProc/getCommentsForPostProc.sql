CREATE OR ALTER PROCEDURE getCommentsForPostProc
    @postorcommentId VARCHAR(200)
AS
BEGIN
    -- Fetch comments for a post
    SELECT *
    FROM commentsTable
    WHERE post_id = @postorcommentId
      AND deleted_at IS NULL;
END;
