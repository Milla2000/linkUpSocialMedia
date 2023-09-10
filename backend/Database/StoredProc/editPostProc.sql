CREATE OR ALTER PROCEDURE editPostProc
    @post_id VARCHAR(200),
    @user_id VARCHAR(200),
    @newContent TEXT,
    @image_url VARCHAR(255)
AS
BEGIN
    -- Check if the user is the author of the post
    IF EXISTS (
        SELECT 1
    FROM postsTable
    WHERE id = @post_id AND user_id = @user_id
    )
    BEGIN
        -- If the user is the author, update the post content and set the updated_at timestamp
        UPDATE postsTable
        SET content = @newContent,
            image_url = @image_url,
            updated_at = GETDATE() -- Set the updated_at timestamp to the current date and time
        WHERE id = @post_id;

        SELECT 'Post updated successfully' AS message;
    END
    ELSE
    BEGIN
        -- User is not authorized to edit the post
        RAISERROR('You are not authorized to edit this post', 16, 1);
    END
END;
