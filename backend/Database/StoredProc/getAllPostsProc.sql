CREATE OR ALTER PROCEDURE getAllPostsProc
AS
BEGIN
    SELECT
        postsTable.*,
        usersTable.username
    FROM
        postsTable
    LEFT JOIN
        usersTable
    ON
        postsTable.user_id = usersTable.id
    WHERE
        postsTable.deleted_at IS NULL;
END;