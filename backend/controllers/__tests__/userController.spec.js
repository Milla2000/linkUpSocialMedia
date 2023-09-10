const mssql = require('mssql');
import {
    returnUsers,
    deleteUser,
    softDeleteUser,
    updateUser,
    viewCartItemsForAdmin
} from "../userController" 

// jest.mock('mssql');

const req = {
    params: {
        id: 'user_id'
    },
    body: {
        username: 'newuser',
        email: 'milla@gmail.com',
        phone_number: '1234567890'
    }
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
};

describe('UserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all users', async () => {
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: [{ id: 'user_id' }] });
        const mockedRequest = {
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await returnUsers(req, res);

        expect(res.json).toHaveBeenCalledWith({ users: [{ id: 'user_id' }] });
    });

    it('should delete a user', async () => {
        const mockedRowsAffected = [1];
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return an error when trying to delete a non-existing user', async () => {
        const mockedRowsAffected = [0];
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return an error when trying to delete a user with cart items', async () => {
        const errorMessage = 'The DELETE statement conflicted with the REFERENCE constraint';
        const error = new Error(errorMessage);
        error.message = `${errorMessage}...`;
        const mockedExecute = jest.fn().mockRejectedValue(error);
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User cannot be deleted because they have products in their cart' });
    });

    it('should soft delete a user', async () => {
        const mockedRowsAffected = [1];
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await softDeleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User soft deleted successfully' });
    });

    it('should return an error when trying to soft delete a non-existing user', async () => {
        const mockedRowsAffected = [0];
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await softDeleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should update user details', async () => {
        const mockedRowsAffected = [1];
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User details updated successfully' });
    });

    it('should return an error when trying to update details of a non-existing user', async () => {
        const mockedRowsAffected = [0];
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should view cart items for admin', async () => {
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: [{ id: 'item_id' }] });
        const mockedRequest = {
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await viewCartItemsForAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 'item_id' }]);
    });

    it('should return an error when no cart items are found for admin', async () => {
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: [] });
        const mockedRequest = {
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        await viewCartItemsForAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No cart items found' });
    });

});


