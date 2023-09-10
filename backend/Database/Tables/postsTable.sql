BEGIN TRY
        CREATE TABLE postsTable (
           id VARCHAR(200) PRIMARY KEY,
           user_id VARCHAR(200) NOT NULL,
           content TEXT NOT NULL,
           image_url VARCHAR(255),
           created_at DATETIME DEFAULT GETDATE(),
           updated_at DATETIME,
           deleted_at DATETIME,
           likes_count INT DEFAULT 0,
           comments_count INT DEFAULT 0,
           FOREIGN KEY (user_id) REFERENCES usersTable(id)
       );
    END TRY
    BEGIN CATCH
        THROW 50001, 'Table already exists!', 1;
    END CATCH

-- //fetch everything
SELECT * FROM postsTable;