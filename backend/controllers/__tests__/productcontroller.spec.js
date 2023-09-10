// import bcrypt from "bcrypt";
import mssql from "mssql";

import {
    createNewProduct,
    viewOneProduct,
    viewAllProducts,
    updateProduct,
    deleteProduct

} from "../productControllers";

jest.mock('mssql');

const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
};

describe('Product Controller Tests', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a new product successfully', async () => {
        const req = {
            body: {
                name: 'New Product',
                description: 'Product description',
                price: 29.99,
                category: 'Electronics',
                image: 'product.jpg',
                num_items: 100
            }
        };
        

        const mockExecute = jest.fn().mockResolvedValueOnce({
            rowsAffected: [1]
        });

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockExecute,
        };

        const mockPool = {
            request: jest.fn().mockReturnValue(mockRequest),
        };

        mssql.connect.mockResolvedValueOnce(mockPool);

        await createNewProduct(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Product created successfully'
        });

        // Assert that mssql.connect and related functions were called as expected
    
        expect(mockPool.request).toHaveBeenCalled();
        // expect(mockRequest.input).toHaveBeenCalledTimes(7);
        expect(mockRequest.execute).toHaveBeenCalledWith('createProductProc');
    });



    it('should return an error message when product creation fails', async () => {
        
        const req = {
            body: {
                
            },
        };
        const res = {
            json: jest.fn(),
        };
        
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
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Execute the controller function
        await createNewProduct(req, res);

        // Assertions
        // expect(mockedInput).toHaveBeenCalledTimes();
        expect(mockedExecute).toHaveBeenCalledWith('createProductProc');
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product creation failed',
        });
    });

    it('should fetch a product by its ID', async () => {
        const mockedProductId = '12345678-abcd-efgh-ijkl-9876543210ab';
        const req = {
            params: {
                id: mockedProductId
            }
        };

        const mockProduct = {
            id: mockedProductId,
            name: 'Product 1',
            description: 'Product description',
            price: 19.99,
            category: 'Electronics',
            image: 'product.jpg',
            num_items: 50
        };

        const pool = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: [mockProduct]
            })
        });

        await viewOneProduct(req, res);

        expect(res.json).toHaveBeenCalledWith({
            product: mockProduct
        });

        res.json.mockRestore();
    });

    it('should fetch all products', async () => {
        const mockProducts = [
            // Mock product objects
        ];

        const pool = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: mockProducts
            })
        });

        await viewAllProducts({}, res);

        expect(res.json).toHaveBeenCalledWith({
            products: mockProducts
        });

        res.json.mockRestore();
    });

    it('should update a product successfully', async () => {
        const mockedProductId = '12345678-abcd-efgh-ijkl-9876543210ab';
        const req = {
            params: {
                id: mockedProductId
            },
            body: {
                name: 'Updated Product',
                description: 'Updated description',
                price: 39.99,
                category: 'Furniture',
                image: 'updated_product.jpg',
                num_items: 75
            }
        };

        const pool = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [1]
            })
        });

        await updateProduct(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Product updated successfully'
        });

        res.json.mockRestore();
    });

    it('should return an error if product is not found during update', async () => {
        const mockedProductId = 'non-existent-id';
        const req = {
            params: {
                id: mockedProductId
            },
            body: {
                name: 'Updated Product',
                description: 'Updated description',
                price: 39.99,
                category: 'Furniture',
                image: 'updated_product.jpg',
                num_items: 75
            }
        };

        const pool = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [0]
            })
        });

        await updateProduct(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Product not found or update failed'
        });

        res.json.mockRestore();
    });

    it('should delete a product successfully', async () => {
        const mockedProductId = '12345678-abcd-efgh-ijkl-9876543210ab';
        const req = {
            params: {
                id: mockedProductId
            }
        };

        const mockRecordset = []; // Empty array to simulate no referenced cart items
        const pool = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn()
                .mockResolvedValueOnce({
                    recordset: mockRecordset // Simulate no referenced cart items
                })
                .mockResolvedValueOnce({
                    rowsAffected: [1]
                })
        });

        await deleteProduct(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Product deleted successfully'
        });

        res.json.mockRestore();
    });

    it('should return an error message if the product is in a cart', async () => {
        // Mock request and response objects
        const mockedProductId = '008dcd61-d86e-4b83-9aac-c0747f3f91b9'; 
        const req = {
            params: {
                id: mockedProductId,
            },
        };
        const res = {
            json: jest.fn(),
        };

        // Mock mssql.connect and related functions
        const cartItemCheckResult = {
            rowsAffected: [1], // Mocked rowsAffected
            recordset: [
                {
                    id: mockedProductId,
                    name: 'Product 1',
                    description: 'Product description',
                    price: 19.99,
                    category: 'Electronics',
                    image: 'product.jpg',
                    num_items: 50
                }
            ],
        };
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce(cartItemCheckResult),
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Execute the controller function
        await deleteProduct(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product cannot be deleted as it is added to a cart.',
        });
    });

    it('should return an error if product is not found during deletion', async () => {
        const mockedProductId = 'non-existent-id';
        const req = {
            params: {
                id: mockedProductId
            }
        };

        const mockEmptyRecordset = []; // Simulate no referenced cart items
        const pool = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn()
                .mockResolvedValueOnce({
                    recordset: mockEmptyRecordset // Simulate no referenced cart items
                })
                .mockResolvedValueOnce({
                    rowsAffected: [0] // Simulate product not found
                })
        });

        await deleteProduct(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Product not found'
        });

        res.json.mockRestore();
    });

    

});
