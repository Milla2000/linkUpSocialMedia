CREATE OR ALTER PROCEDURE getSubCommentsForCommentProc
    @postorcommentId VARCHAR(200)
AS
BEGIN
    -- Fetch sub-comments for a comment
    SELECT *
    FROM commentsTable
    WHERE parent_comment_id = @postorcommentId
      AND deleted_at IS NULL;
END;
