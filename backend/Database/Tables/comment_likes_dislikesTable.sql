BEGIN TRY
        CREATE TABLE comment_likes_dislikesTable (
            id VARCHAR(200) PRIMARY KEY,
            user_id VARCHAR(200) NOT NULL,
            comment_id VARCHAR(200) NOT NULL,
            like_or_dislike BIT NOT NULL,
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (user_id) REFERENCES usersTable(id),
            FOREIGN KEY (comment_id) REFERENCES commentsTable(id)
        );
    END TRY
    BEGIN CATCH
        THROW 50003, 'Table already exists!', 1;
    END CATCH