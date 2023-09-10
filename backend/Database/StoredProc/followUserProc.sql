CREATE OR ALTER PROCEDURE followUserProc
    @follower_id VARCHAR(200),
    @following_id VARCHAR(200)
AS
BEGIN
    -- Check if the user is trying to follow themselves
    IF @follower_id = @following_id
    BEGIN
        RETURN 0; -- You cannot follow yourself
    END

    -- Check if the user is already following the target user
    IF EXISTS (
        SELECT 1
        FROM user_followingTable
        WHERE follower_id = @follower_id AND following_id = @following_id
    )
    BEGIN
        RETURN 1; -- You are already following this user
    END

    -- Insert a new row into the user_following table
    INSERT INTO user_followingTable (follower_id, following_id)
    VALUES (@follower_id, @following_id);

    -- Update the followers count for the following user
    UPDATE usersTable
    SET followers_count = followers_count + 1
    WHERE id = @following_id;

    -- Update the following count for the follower user
    UPDATE usersTable
    SET following_count = following_count + 1
    WHERE id = @follower_id;

    RETURN 2; -- Successfully followed the user
END;