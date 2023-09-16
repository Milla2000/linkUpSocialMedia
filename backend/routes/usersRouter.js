const { Router } = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const { registerUser, userLogin, otpController, checkUser } = require('../controllers/authControllers');
const { softDeleteUser, editUser, getAllUsers, getAUserDetails,  } = require('../controllers/userController');

const usersRouter = Router()

//this are auth routes for users
usersRouter.post('/register', registerUser)
usersRouter.post('/login', userLogin)
usersRouter.post('/verifyotp', otpController.verifyOTP)
// usersRouter.get('/check', verifyToken, checkUser)


//this are routes for users
usersRouter.put('/edit/:id', verifyToken, editUser)
usersRouter.delete('/softdelete/:id', verifyToken, softDeleteUser)
usersRouter.get('/getallusers', getAllUsers)
usersRouter.get('/singleusers/:userId', verifyToken, getAUserDetails)




module.exports = {
    usersRouter
}
