const mssql = require("mssql");
const { sqlConfig } = require("../../config/config");

const createUsersTable = async () => {
  try {
    const table = `
      BEGIN TRY
        CREATE TABLE usersTable (
            id VARCHAR(200) PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),        
            profile_picture VARCHAR(255),
            created_at DATETIME DEFAULT GETDATE(),
            updated_at DATETIME,
            resetToken VARCHAR(200),
            resetTokenExpiry DATETIME,
            otp VARCHAR(6), -- Add OTP column (6 characters)
            otpExpiry DATETIME, -- Add OTP expiry timestamp
            deleted_at DATETIME,
            followers_count INT DEFAULT 0, -- Count of followers
            following_count INT DEFAULT 0 -- Count of following
        );
        END TRY
      BEGIN CATCH
        THROW 50001, 'Table already exists!', 1;
       END CATCH;
    `;

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("UsersTable created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};

const createPostsTable = async () => {
  try {
    const table = `
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
    `;

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("PostsTable created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};

const createCommentsTable = async () => {
  try {
    const table = `
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
    `;

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("CommentsTable created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};


const createPostLikesTable = async () => {
  try {
    const table = `
    BEGIN TRY
        CREATE TABLE post_likes_dislikesTable (
            id VARCHAR(200) PRIMARY KEY,
            user_id VARCHAR(200) NOT NULL,
            post_id VARCHAR(200) NOT NULL,
            like_or_dislike BIT NOT NULL,
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (user_id) REFERENCES usersTable(id),
            FOREIGN KEY (post_id) REFERENCES posts(id)
        );
    END TRY
    BEGIN CATCH
        THROW 50002, 'Table already exists!', 1;
    END CATCH
    `;

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("PostLikesDislikesTable created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};

const createCommentLikesTable = async () => {
  try {
    const table = `
    BEGIN TRY
        CREATE TABLE comment_likes_dislikesTable (
            id VARCHAR(200) PRIMARY KEY,
            user_id VARCHAR(200) NOT NULL,
            comment_id VARCHAR(200) NOT NULL,
            like_or_dislike BIT NOT NULL,
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (user_id) REFERENCES usersTable(id),
            FOREIGN KEY (comment_id) REFERENCES comments(id)
        );
    END TRY
    BEGIN CATCH
        THROW 50003, 'Table already exists!', 1;
    END CATCH
    `;

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("CommentLikesDislikesTable created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};

const user_followingTable = async () => {
  try {
    const table = `
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
    `;

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("user_followingTable created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};

module.exports = {
  createUsersTable,
  createPostsTable,
  createCommentsTable,
  createPostLikesTable,
  createCommentLikesTable,
  user_followingTable
};
