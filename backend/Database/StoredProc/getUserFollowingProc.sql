CREATE OR ALTER PROCEDURE getUserFollowingProc
    @userId VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    -- Retrieve users followed by the user
    SELECT
        following_id
    FROM
        user_followingTable
    WHERE
        follower_id = @userId;
END
