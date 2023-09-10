CREATE OR ALTER PROCEDURE getUserOTPProc
    @email VARCHAR(100)
AS
BEGIN
    SELECT id, otp, otpExpiry
    FROM usersTable
    WHERE email = @email;
END;
