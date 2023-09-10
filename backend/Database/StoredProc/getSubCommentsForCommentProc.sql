CREATE OR ALTER PROCEDURE getSubCommentsForCommentProc
    @commentId VARCHAR(200)
AS
BEGIN
    -- Fetch sub-comments for a comment
    SELECT *
    FROM comments
    WHERE parent_comment_id = @commentId
      AND deleted_at IS NULL;
END;
