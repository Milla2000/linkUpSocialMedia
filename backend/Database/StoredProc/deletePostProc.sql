CREATE OR ALTER PROCEDURE deletePostProc
    @user_id VARCHAR(200),
    @post_id VARCHAR(200)
AS
BEGIN
    -- Check if the user is the author of the post
    IF EXISTS (
        SELECT 1
        FROM postsTable
        WHERE id = @post_id AND user_id = @user_id
    )
    BEGIN
        -- If the user is the author, update the deleted_at timestamp to mark the post as deleted
        UPDATE postsTable
        SET deleted_at = GETDATE() -- Set the deleted_at timestamp to the current date and time
        WHERE id = @post_id;
        
        RETURN 0; -- Success
    END
    ELSE
    BEGIN
        -- User is not authorized to delete the post
        RETURN 1; -- Not authorized
    END
END;

