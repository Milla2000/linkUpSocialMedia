import bcrypt from "bcrypt";
import mssql from "mssql";
import jwt from "jsonwebtoken";
import { registerUser, userLogin } from "../authControllers";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const req = {
    body: {
        username: "ngatia1111111141",
        email: "jes1so@gmail.com",
        password: "12345678",
        phone_number: "123456781"
    }
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
};

describe("Register an Employee", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should register a new employee successfully", async () => {
        // Mocking mssql.connect and related functions
        const mockedInput = jest.fn().mockReturnThis();
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute,
            
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Mock bcrypt.hash
        bcrypt.hash.mockResolvedValue("kjhgsaiuytwiulkyiyui");

        // Execute the controller function
        await registerUser(req, res);

        // Assertions
        expect(mockedInput).toHaveBeenCalledWith("id", expect.any(String));
        expect(mockedInput).toHaveBeenCalledWith("username", mssql.VarChar, "ngatia1111111141");
        expect(mockedInput).toHaveBeenCalledWith("email", mssql.VarChar, "jes1so@gmail.com");
        // ... other assertions

        expect(mockedExecute).toHaveBeenCalledWith("registerUserProc");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User registered successfully",
        });
    });

    it("Fails if body is missing email or password", async () => {
        const request = {
            body: {
                username: "ngatia1111111141",
                email: "jes1so@gmail.com",
            },
        };

        await registerUser(request, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Please input all values" });
    });
    

    it("Fails with error if registration fails", async () => {
        // Mocking mssql.connect and related functions
        const mockedInput = jest.fn().mockReturnThis();
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [0] });
        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Mock bcrypt.hash
        bcrypt.hash.mockResolvedValue("kjhgsaiuytwiulkyiyui");

        // Execute the controller function
        await registerUser(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Registration failed",
        });
    });
});


describe("Employee login tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if email or password is missing", async () => {
        const req = { body: {} };

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Please input all values",
        });
    });

    it("should return an error if email is not found/registered", async () => {
        const req = {
            body: {
                email: "abc@gmail.com",
                password: "12345678",
            },
        };

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest
                .fn()
                .mockResolvedValueOnce({ rowsAffected: [0], recordset: [] }),
        });

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email does not exist in the system, Please use a valid email address",
        });
    });

    it("should return an error if password is incorrect", async () => {
        const expectedUser = {
            full_name: "Johgnh Jesso",
            email: "johnJgessgdko@gmail.com",
            password: "cvbvcvbcv", // Mocked password
        };

        const req = {
            body: {
                email: expectedUser.email,
                password: "12345678", // Provided password
            },
        };

        // Mock mssql.connect
        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: 1,
                recordset: [expectedUser],
            }),
        });

        // Mock bcrypt.compare
        bcrypt.compare.mockResolvedValueOnce(false);

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Incorrect password" });
    });

    it("should return a token and log in user successfully", async () => {
        const expectedUser = {
            email: "jes1so@gmail.com",
            password: "12345678",
        };

        const req = {
            body: {
                email: expectedUser.email,
                password: "password",
            },
        };

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: 1,
                recordset: [expectedUser],
            }),
        });

        bcrypt.compare.mockResolvedValueOnce(true);

        jwt.sign.mockReturnValueOnce("mockedToken");

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Logged in",
            token: "mockedToken",
        });
    });
});
