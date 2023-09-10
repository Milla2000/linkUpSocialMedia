CREATE OR ALTER PROCEDURE toggleLikeUnlikePostProc
    @id VARCHAR(200), -- Add the id parameter
    @user_id VARCHAR(200),
    @post_id VARCHAR(200)
AS
BEGIN
    -- Check if the user has already liked this post
    IF EXISTS (
        SELECT 1
        FROM post_likes_dislikesTable
        WHERE id = @id AND user_id = @user_id AND post_id = @post_id
    )
    BEGIN
        -- User has already liked, so unlike it
        DELETE FROM post_likes_dislikesTable
        WHERE id = @id; -- Delete by id

        -- Update the likes_count in the postsTable by reducing it
        UPDATE postsTable
        SET likes_count = likes_count - 1
        WHERE id = @post_id;

        -- Return success for unliking
        RETURN 0;
    END
    ELSE
    BEGIN
        -- User has not liked, so like it
        INSERT INTO post_likes_dislikesTable (id, user_id, post_id, like_or_dislike)
        VALUES (@id, @user_id, @post_id, 1); -- 1 represents a like

        -- Update the likes_count in the postsTable by increasing it
        UPDATE postsTable
        SET likes_count = likes_count + 1
        WHERE id = @post_id;

        -- Return success for liking
        RETURN 1;
    END
END;
