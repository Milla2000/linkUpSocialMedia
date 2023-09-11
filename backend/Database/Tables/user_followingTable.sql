BEGIN TRY
    CREATE TABLE user_followingTable (
        follower_id VARCHAR(200) NOT NULL,
        following_id VARCHAR(200) NOT NULL,
        PRIMARY KEY (follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES usersTable(id),
        FOREIGN KEY (following_id) REFERENCES usersTable(id)
    );
END TRY
BEGIN CATCH
    THROW 50002, 'Table already exists!', 1;
END CATCH;

--dro table
-- DROP TABLE user_following;
SELECT * FROM user_followingTable;
