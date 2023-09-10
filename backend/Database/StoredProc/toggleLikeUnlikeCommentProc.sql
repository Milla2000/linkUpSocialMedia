CREATE OR ALTER PROCEDURE toggleLikeUnlikeCommentProc
    @id VARCHAR(200), -- Add the id parameter
    @user_id VARCHAR(200),
    @comment_id VARCHAR(200)
AS
BEGIN
    -- Check if the user has already liked this comment
    IF EXISTS (
        SELECT 1
        FROM comment_likes_dislikesTable
        WHERE id = @id AND user_id = @user_id AND comment_id = @comment_id
    )
    BEGIN
        -- User has already liked, so unlike it
        DELETE FROM comment_likes_dislikesTable
        WHERE id = @id; -- Delete by id

        -- Set like_or_dislike to 0 for unliking
        UPDATE commentsTable
        SET likes_count = likes_count - 1
        WHERE id = @comment_id;

        -- Return success for unliking
        RETURN 0;
    END
    ELSE
    BEGIN
        -- User has not liked, so like it
        INSERT INTO comment_likes_dislikesTable (id, user_id, comment_id, like_or_dislike)
        VALUES (@id, @user_id, @comment_id, 1); -- Set like_or_dislike to 1 for liking

        -- Update the likes_count in the commentsTable by increasing it
        UPDATE commentsTable
        SET likes_count = likes_count + 1
        WHERE id = @comment_id;

        -- Return success for liking
        RETURN 1;
    END
END;
