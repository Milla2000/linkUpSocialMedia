CREATE OR ALTER PROCEDURE editCommentProc
    @comment_id VARCHAR(200),
    @user_id VARCHAR(200),
    @newContent TEXT
AS
BEGIN
    -- Check if the user is the author of the comment
    IF EXISTS (
        SELECT 1
        FROM comments
        WHERE id = @comment_id AND user_id = @user_id
    )
    BEGIN
        -- If the user is the author, update the comment content
        UPDATE comments
        SET content = @newContent
        WHERE id = @comment_id;
        
        RETURN 0; -- Success
    END
    ELSE
    BEGIN
        -- User is not authorized to edit the comment
        RETURN 1; -- Not authorized
    END
END;
