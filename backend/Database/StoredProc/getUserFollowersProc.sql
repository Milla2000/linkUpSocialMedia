CREATE OR ALTER PROCEDURE getUserFollowersProc
    @userId VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    -- Retrieve user's followers
    SELECT
        follower_id
    FROM
        user_followingTable
    WHERE
        following_id = @userId;
END
