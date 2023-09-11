CREATE OR ALTER PROCEDURE insertCommentProc
    @id VARCHAR(200),
    @post_id VARCHAR(200),
    @user_id VARCHAR(200),
    @content TEXT,
    @parent_comment_id VARCHAR(200) = NULL, -- Nullable for replies to comment
    @updated_at DATETIME = NULL,
    @deleted_at DATETIME = NULL,
    @likes_count INT = 0,
    @sub_comments_count INT = 0
AS
BEGIN
    INSERT INTO commentsTable (id, post_id, user_id, content, parent_comment_id, created_at, updated_at, deleted_at, likes_count, sub_comments_count)
    VALUES (@id, @post_id, @user_id, @content, @parent_comment_id, GETDATE(), @updated_at, @deleted_at, @likes_count, @sub_comments_count);
END;
