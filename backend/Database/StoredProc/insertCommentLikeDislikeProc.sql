CREATE OR ALTER PROCEDURE InsertCommentLikeDislikeProc
    @id VARCHAR(200),
    @user_id VARCHAR(200),
    @comment_id VARCHAR(200),
    @like_or_dislike BIT,
    @created_at DATETIME  -- You can specify a custom date and time if needed
AS
BEGIN
    INSERT INTO comment_likes_dislikesTable (id, user_id, comment_id, like_or_dislike, created_at)
    VALUES (@id, @user_id, @comment_id, @like_or_dislike, GETDATE());
END;
