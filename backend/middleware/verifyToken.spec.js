import jwt from 'jsonwebtoken'
import { verifyToken } from './verifyToken';


const mockrequest = ()=>{
    return {
        headers:{
            token:'valid_token'
        }
    }
}

const mockResponse = ()=>{
    return{
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }
}

const mockNext = jest.fn()



describe('verify token middleware',()=>{
    it('it should verify if no token it throws an error', async ()=>{
        const mockReq = mockrequest().headers={
                    headers:{}
        }
        
            
                const mockRes = mockResponse()
                const next = mockNext()
        
                await verifyToken(mockReq,mockRes,next)

                expect(mockRes.json).toHaveBeenCalledWith({message: "Restricted access, please provide a token"})
                expect(mockRes.status).toHaveBeenCalledWith(403)
               
        
    })

    it('should authorize the users if they have a valid token',async()=>{
        const mockUser = {
            id: "ed53d1f3-5242-420b-bf42-023046a1d8a9",
            full_name: "Milla Wachira Siloma",
            email: "ignit3graphics@gmail.com",
            assignedProject: null,
            role: "admin",
        }

        const outPutRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            info: mockUser
        }

        jest.spyOn(jwt, 'verify').mockResolvedValueOnce({
            outPutRes
        })

        await verifyToken(mockrequest,outPutRes,mockNext)

        expect(mockNext).toHaveBeenCalled()
        expect(mockNext).toHaveBeenCalledTimes(1)
        expect(mockNext).toBeCalledTimes(1)

    })

    // it('should return invalid token if token has expired',async()=>{

    // })
})