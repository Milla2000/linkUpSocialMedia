
import mssql from "mssql";
// import jwt from "jsonwebtoken";
import {
    addToCart,
    getCartItems,
    checkout,
    removeFromCart,
} from "../cartControllers";


const req = {
    body: {
        user_id: "e05ad994-b084-48ba-a6b5-a97afa99522b",
        product_id: "008dcd61-d86e-4b83-9aac-c0747f3f91b9"  
    },
    params: {
        
    },
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
};

describe("Add to Cart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if user does not exist", async () => {
        const mockedInput = jest.fn().mockReturnThis();
        const mockedQuery = jest.fn().mockResolvedValue({ recordset: [] });
        const mockedRequest = {
            input: mockedInput,
            query: mockedQuery,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        await addToCart(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    // it("should return an error if product is out of stock", async () => {
    //     // Mock mssql.connect and related functions
    //     const mockedInput = jest.fn().mockReturnThis();
    //     const mockedExecute = jest.fn().mockResolvedValue({ recordset: [{ name: "Product", price: 10, num_items: 0 }] }); // Product out of stock
    //     const mockedRequest = {
    //         input: mockedInput,
    //         execute: mockedExecute,
    //     };
    //     const mockedPool = {
    //         request: jest.fn().mockReturnValue(mockedRequest),
    //     };
    //     jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

    //     // Execute the controller function
    //     await addToCart(req, res);

    //     // Capture the arguments passed to mockedExecute
    //     const capturedExecuteArguments = mockedExecute.mock.calls[0];

    //     // Assertions
    //     expect(capturedExecuteArguments[0]).toBe("fetchOneProductProc");

    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({ error: "Product is out of stock" });
    // });


    it("should create a new cart and add product to cart successfully", async () => {
        // Mock mssql.connect and related functions
        const mockedInput = jest.fn().mockReturnThis();
        const mockedQuery = jest.fn().mockResolvedValue({ recordset: [{ id: "existing_cart_id" }] });
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: [{ total_price: 100 }] });
        const mockedRequest = {
            input: mockedInput,
            query: mockedQuery,
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        await addToCart(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Product added to cart successfully",
            total_price: 100,
        });
    });

    
});

describe("Get Cart Items", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return cart items for a valid user", async () => {
        // Mock mssql.connect and related functions
        const userId = "valid_user_id";
        const cartItems = [{ id: 1, product_name: "Product 1" }, { id: 2, product_name: "Product 2" }];
        const mockedInput = jest.fn().mockReturnThis();
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: cartItems });
        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        req.params.userId = userId;
        await getCartItems(req, res);

        // Assertions
        expect(mockedInput).toHaveBeenCalledWith("user_id", mssql.VarChar, userId);
        expect(mockedExecute).toHaveBeenCalledWith("fetchCartItemsProc");
        expect(res.json).toHaveBeenCalledWith({
            cartItems: cartItems,
        });
    });

    it("should handle error when fetching cart items", async () => {
        // Mock mssql.connect and related functions
        const userId = "valid_user_id";
        const errorMessage = "Error fetching cart items";
        const mockedInput = jest.fn().mockReturnThis();
        const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        req.params.userId = userId;
        await getCartItems(req, res);

        // Assertions
        expect(mockedInput).toHaveBeenCalledWith("user_id", mssql.VarChar, userId);
        expect(mockedExecute).toHaveBeenCalledWith("fetchCartItemsProc");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});


describe("Checkout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if cart is empty", async () => {
        // Mock mssql.connect and related functions
        const userId = "valid_user_id";
        const cartCheckResult = { recordset: [] };
        const mockedInput = jest.fn().mockReturnThis();
        const mockedQuery = jest.fn().mockResolvedValue(cartCheckResult);
        const mockedRequest = {
            input: mockedInput,
            query: mockedQuery,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        req.body.user_id = userId;
        await checkout(req, res);

        // Assertions
        expect(mockedInput).toHaveBeenCalledWith("user_id", mssql.VarChar, userId);
        expect(mockedQuery).toHaveBeenCalledWith("SELECT id FROM cartsTable WHERE user_id = @user_id");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Cart not found" });
    });

    it("should return an error if cart is empty", async () => {
        // Mock mssql.connect and related functions
        const userId = "valid_user_id";
        const cartCheckResult = { recordset: [{ id: "cart_id" }] };
        const totalPriceResult = { recordset: [{ total_price: 0 }] };
        const cartItemsCheckResult = { recordset: [{ item_count: 0 }] };
        const mockedInput = jest.fn().mockReturnThis();
        const mockedQuery = jest.fn()
            .mockResolvedValueOnce(cartCheckResult)
            .mockResolvedValueOnce(totalPriceResult)
            .mockResolvedValueOnce(cartItemsCheckResult);
        const mockedRequest = {
            input: mockedInput,
            query: mockedQuery,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        req.body.user_id = userId;
        await checkout(req, res);

        // Assertions
        expect(mockedQuery).toHaveBeenCalledTimes(3);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("You have no products in your cart, Kindly add products to your cart to make a purchase");
    });

    it("should successfully checkout and return total price", async () => {
        // Mock mssql.connect and related functions
        const userId = "valid_user_id";
        const cartCheckResult = { recordset: [{ id: "cart_id" }] };
        const totalPriceResult = { recordset: [{ total_price: 100 }] };
        const cartItemsCheckResult = { recordset: [{ item_count: 2 }] };
        const productNameResult = { recordset: [{ product_name: "Product A" }] };
        const mockedInput = jest.fn().mockReturnThis();
        const mockedQuery = jest.fn()
            .mockResolvedValueOnce(cartCheckResult)
            .mockResolvedValueOnce(totalPriceResult)
            .mockResolvedValueOnce(cartItemsCheckResult)
            .mockResolvedValueOnce(productNameResult);
        const mockedExecute = jest.fn();
        const mockedRequest = {
            input: mockedInput,
            query: mockedQuery,
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        req.body.user_id = userId;
        await checkout(req, res);

        // Assertions
        expect(mockedQuery).toHaveBeenCalledTimes(4);
        expect(mockedExecute).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Checkout completed successfully",
            total_price: 100,
        });
    });
});


describe("Remove from Cart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should remove product from user's cart and increase num_items", async () => {
        // Mock mssql.connect and related functions
        const userId = "valid_user_id";
        const productId = "product_id";
        const cartItemResult = { recordset: [{ id: "cart_item_id" }] };
        const mockedInput = jest.fn().mockReturnThis();
        const mockedQuery = jest.fn().mockResolvedValue(cartItemResult);
        const mockedExecute = jest.fn();
        const mockedRequest = {
            input: mockedInput,
            query: mockedQuery,
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        req.body.user_id = userId;
        req.body.product_id = productId;
        await removeFromCart(req, res);

        // Assertions
        expect(mockedQuery).toHaveBeenCalledTimes(1);
        expect(mockedExecute).toHaveBeenCalledTimes(2);
        expect(mockedExecute).toHaveBeenCalledWith("removeProductFromCartProc");
        expect(mockedExecute).toHaveBeenCalledWith("increaseNumItemsProc");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Product removed from cart successfully" });
    });


    it("should return an error if product is not in user's cart", async () => {
        // Mock mssql.connect and related functions
        const userId = "valid_user_id";
        const productId = "product_id";
        const cartItemResult = { recordset: [] };
        const mockedInput = jest.fn().mockReturnThis();
        const mockedQuery = jest.fn().mockResolvedValue(cartItemResult);
        const mockedExecute = jest.fn();
        const mockedRequest = {
            input: mockedInput,
            query: mockedQuery,
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

        // Execute the controller function
        req.body.user_id = userId;
        req.body.product_id = productId;
        await removeFromCart(req, res);

        // Assertions
        expect(mockedQuery).toHaveBeenCalledTimes(1);
        expect(mockedExecute).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Product not found in user's cart" });
    });

    
});


    

