const { Router } = require('express');
const { verifyToken } = require('../middleware/verifyToken'); // Assuming you have token verification middleware
const { toggleLikeUnlikeComment, toggleLikeUnlikePost } = require('../controllers/likesController');

const likeRouter = Router()


// Route to toggle like/unlike on a comment
likeRouter.post('/like-unlike-comment', verifyToken, toggleLikeUnlikeComment);
// Route to toggle like/unlike on a post
likeRouter.post('/like-unlike-post', verifyToken, toggleLikeUnlikePost);


module.exports = {
    likeRouter
}
