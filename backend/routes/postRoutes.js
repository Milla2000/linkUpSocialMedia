const {Router} = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const { createNewPost, editPost, deletePostId, getAllPosts, getPostsByUserId, viewPostById } = require('../controllers/postsController');
// const { viewAllProducts, viewOneProduct, updateProduct, deleteProduct, createNewProduct } = require('../controllers/productControllers');

const postsRouter = Router();

postsRouter.post('/createnewpost',  createNewPost);
postsRouter.get('/getallposts', getAllPosts); 
postsRouter.get('/getpostsbyuserid/:userId', verifyToken, getPostsByUserId); 
postsRouter.get('/:postId', viewPostById);
postsRouter.put('/edityourpost', verifyToken, editPost);
postsRouter.delete('/softdeleteyourpost', verifyToken, deletePostId);

module.exports = {
    postsRouter
}

// postsRouter.post('/createnewpost', verifyToken, createNewPost);
// postsRouter.get('/getallposts', getAllPosts); //
// postsRouter.get('/getpostsbyuserid', verifyToken, getPostsByUserId); //
// postsRouter.get('/:postId', viewPostById);
// postsRouter.put('/edityourpost', verifyToken, editPost);
// postsRouter.delete('/deleteyourpost', verifyToken, deletePostId);

// module.exports = {
//     postsRouter
// }
