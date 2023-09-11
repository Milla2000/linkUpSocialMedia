CREATE OR ALTER PROCEDURE toggleLikeUnlikeCommentProc
    @id VARCHAR(200), -- Add the id parameter
    @user_id VARCHAR(200),
    @comment_id VARCHAR(200)
AS
BEGIN
    DECLARE @action INT;

    -- Check if the user has already liked or unliked this comment
    SELECT @action = like_or_dislike
    FROM comment_likes_dislikesTable
    WHERE user_id = @user_id AND comment_id = @comment_id;

    IF @action IS NULL
    BEGIN
        -- User has not liked, so like it
        INSERT INTO comment_likes_dislikesTable (id, user_id, comment_id, like_or_dislike)
        VALUES (@id, @user_id, @comment_id, 1); -- 1 represents a like

        -- Update the likes_count in the commentsTable by increasing it
        UPDATE commentsTable
        SET likes_count = likes_count + 1
        WHERE id = @comment_id;

        -- Return success for liking
        RETURN 1;
    END
    ELSE IF @action = 1
    BEGIN
        -- User has already liked, so unlike it
        DELETE FROM comment_likes_dislikesTable
        WHERE user_id = @user_id AND comment_id = @comment_id;

        -- Update the likes_count in the commentsTable by reducing it
        UPDATE commentsTable
        SET likes_count = likes_count - 1
        WHERE id = @comment_id;

        -- Return success for unliking
        RETURN 0;
    END
END;
