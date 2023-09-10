CREATE OR ALTER PROCEDURE createPostProc
    @id VARCHAR(200),
    @user_id VARCHAR(200) ,
    @content TEXT,
    @image_url VARCHAR(255),
    @created_at DATETIME,
    @updated_at DATETIME = NULL,
    @deleted_at DATETIME = NULL,
    @likes_count INT = 0,
    @comments_count INT = 0
AS
BEGIN
    INSERT INTO postsTable (id, user_id, content, image_url, created_at, updated_at, deleted_at, likes_count, comments_count)
    VALUES (@id, @user_id, @content, @image_url, GETDATE(), @updated_at, @deleted_at, @likes_count, @comments_count);
END;



