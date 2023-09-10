CREATE OR ALTER PROCEDURE setOTPAndExpiryTimeProc
@Email VARCHAR(255),
@otp VARCHAR(10),
@OTPExpiry DATETIME
AS
BEGIN
    UPDATE usersTable
    SET otp = @otp, otpExpiry = @OTPExpiry
    WHERE email = @Email;
END;
