const { Router } = require('express');
const { verifyToken } = require('../middleware/verifyToken');
// const { getCartItems, addToCart, checkout, removeFromCart } = require('../controllers/cartControllers');
const { getComments, createComment, editComment, softDeleteComment } = require('../controllers/commentController');

const commentsRouter = Router()
// app.use(cors());

commentsRouter.delete('/softdeletecomment', verifyToken, softDeleteComment);
commentsRouter.post('/createcomment', verifyToken, createComment);
commentsRouter.put('/editcomment', verifyToken, editComment);
commentsRouter.get('/getcomments', getComments);










module.exports = {
    commentsRouter
}