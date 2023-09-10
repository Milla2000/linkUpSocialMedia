CREATE OR ALTER PROCEDURE unfollowUserProc
    @follower_id VARCHAR(200),
    @following_id VARCHAR(200)
AS
BEGIN
    -- Check if the user is trying to unfollow a user they are not following
    IF NOT EXISTS (
        SELECT 1
        FROM user_followingTable
        WHERE follower_id = @follower_id AND following_id = @following_id
    )
    BEGIN
        RETURN 0; -- You are not following this user
    END

    -- Delete the row from the user_following table
    DELETE FROM user_followingTable
    WHERE follower_id = @follower_id AND following_id = @following_id;

    -- Update the followers count for the following user
    UPDATE usersTable
    SET followers_count = followers_count - 1
    WHERE id = @following_id;

    -- Update the following count for the follower user
    UPDATE usersTable
    SET following_count = following_count - 1
    WHERE id = @follower_id;

    RETURN 1; -- Successfully unfollowed the user
END;