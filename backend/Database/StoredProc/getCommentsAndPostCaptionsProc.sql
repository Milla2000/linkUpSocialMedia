-- Create or alter a procedure to retrieve comments and post captions
CREATE OR ALTER PROCEDURE getCommentsAndPostCaptionsProc
AS
BEGIN
    -- Fetch comments and post captions
    SELECT content AS comment_text, NULL AS post_caption FROM commentsTable
    UNION ALL
    SELECT content AS post_caption, NULL AS comment_text FROM postsTable;
END;
