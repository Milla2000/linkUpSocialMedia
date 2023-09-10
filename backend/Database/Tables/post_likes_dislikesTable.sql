BEGIN TRY
   CREATE TABLE post_likes_dislikesTable(
    id VARCHAR(200) PRIMARY KEY,
    user_id VARCHAR(200) NOT NULL,
    post_id VARCHAR(200) NOT NULL,
    like_or_dislike BIT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES usersTable(id),
    FOREIGN KEY (post_id) REFERENCES postsTable(id)
);
    END TRY
    BEGIN CATCH
        THROW 50002, 'Table already exists!', 1;
    END CATCH

