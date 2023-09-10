CREATE OR ALTER PROCEDURE UpdateOTPAndExpiryProc
    @email VARCHAR(100)
AS
BEGIN
    UPDATE usersTable
    SET otp = NULL, otpExpiry = NULL
    WHERE email = @email;
END;
