const { Router } = require('express');
const { unfollowUser, followUser, getUserFollowers, getUserFollowing } = require('../controllers/followersAndFollowingController');
const { verifyToken } = require('../middleware/verifyToken');

const followUnfollowRouter = Router()
// Route to unfollow a user
followUnfollowRouter.post('/user/unfollow', verifyToken, unfollowUser);

// Route to follow a user
followUnfollowRouter.post('/user/follow', verifyToken, followUser);

// Route to get a user's followers
followUnfollowRouter.get('/user/followers/:userId', verifyToken, getUserFollowers);

// Route to get users followed by a user
followUnfollowRouter.get('/user/following/:userId', verifyToken, getUserFollowing);

module.exports = {
    followUnfollowRouter
}
