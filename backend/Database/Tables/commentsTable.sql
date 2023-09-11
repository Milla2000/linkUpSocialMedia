BEGIN TRY
        CREATE TABLE commentsTable (
            id VARCHAR(200) PRIMARY KEY,
            post_id VARCHAR(200) NOT NULL,
            user_id VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            parent_comment_id VARCHAR(200), -- Nullable for replies to comments
            created_at DATETIME DEFAULT GETDATE(),
            updated_at DATETIME,
            deleted_at DATETIME,
            likes_count INT DEFAULT 0,
            sub_comments_count INT DEFAULT 0,
            FOREIGN KEY (post_id) REFERENCES postsTable(id),
            FOREIGN KEY (user_id) REFERENCES usersTable(id),
            FOREIGN KEY (parent_comment_id) REFERENCES commentsTable(id)
        );
    END TRY
    BEGIN CATCH
        THROW 50004, 'Table already exists!', 1;
    END CATCH

 SELECT * FROM commentsTable;



