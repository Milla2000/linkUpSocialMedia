const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error } = loginSchema.validate(req.body);
        if (!email || !password) {
            return res.status(400).json({
                error: "Please input all values",
            });
        }

        if (error) {
            return res.status(422).json(error.details);
        }

        const pool = await mssql.connect(sqlConfig);

        // Fetch user details
        const user = (
            await pool
                .request()
                .input("email", mssql.VarChar, email)
                .execute("userLoginProc")
        ).recordset[0];

        if (!user) {
            return res.status(404).json({ message: "Email does not exist in the system, Please use a valid email address" });
        }

        // Check if the account is deactivated (soft deleted)
        if (user.deleted_at !== null) {
            return res.status(403).json({ message: "Your account is deactivated. Please contact the administrator for assistance." });
        }

        const comparePwd = await bcrypt.compare(password, user.password);

        if (!comparePwd) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate a random 6-digit OTP
        const generateOTP = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };

        // Generate OTP
        const otp = generateOTP();

        // Send OTP to the user
        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "One-Time Password (OTP)",
            text: `Your OTP is: ${otp}`,
        };

        try {
            // Send OTP via email
            await sendMail(message);
            console.log("OTP sent:", message);
        } catch (error) {
            console.log("Error sending OTP:", error);
            throw new Error("Error sending OTP");
        }

        // Store the OTP and its expiry timestamp in the user's record in the database
        const otpExpiry = new Date(Date.now() + 600000); // OTP expires in 10 minutes
        await pool
            .request()
            .input("email", email)
            .input("otp", otp)
            .input("otpExpiry", otpExpiry)
            .execute("setOTPAndExpiryTimeProc");

        return res.status(200).json({ id: user.id, message: "OTP sent successfully" });
    } catch (error) {
        if (error.message.includes("duplicate key value")) {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ error: error.message });
    }
};

