CREATE OR ALTER PROCEDURE SoftDeleteCommentProc
    @comment_id VARCHAR(200),
    @userId VARCHAR(200)
AS
BEGIN
    -- Check if the comment exists, is not already deleted, and is owned by the user
    IF EXISTS (
        SELECT 1
        FROM commentsTable
        WHERE id = @comment_id AND deleted_at IS NULL AND user_id = @userId
    )
    BEGIN
        -- Check if it's a top-level comment or a reply
        IF EXISTS (
            SELECT 1
            FROM commentsTable
            WHERE parent_comment_id = @comment_id
        )
        BEGIN
            -- It's a reply, reduce sub_comments_count
            UPDATE commentsTable
            SET deleted_at = GETDATE(), sub_comments_count = sub_comments_count - 1
            WHERE id = @comment_id;
        END
        ELSE
        BEGIN
            -- It's a top-level comment, reduce comments_count
            UPDATE postsTable
            SET comments_count = comments_count - 1
            WHERE id = (SELECT post_id FROM commentsTable WHERE id = @comment_id);

            UPDATE commentsTable
            SET deleted_at = GETDATE()
            WHERE id = @comment_id;
        END

        RETURN 1; -- Success
    END
    ELSE
    BEGIN
        -- Comment does not exist, is already deleted, or is not owned by the user
        RETURN 0; -- Failure
    END
END;