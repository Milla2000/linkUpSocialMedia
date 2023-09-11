const { Router } = require('express');
const { unfollowUser, followUser, getUserFollowers, getUserFollowing } = require('../controllers/followersAndFollowingController');
const { verifyToken } = require('../middleware/verifyToken');

const followUnfollowRouter = Router()
// Route to unfollow a user
followUnfollowRouter.post('/unfollow', verifyToken, unfollowUser);

// Route to follow a user
followUnfollowRouter.post('/follow', verifyToken, followUser);

// Route to get a user's followers
followUnfollowRouter.get('/followers/:userId', verifyToken, getUserFollowers);

// Route to get users followed by a user
followUnfollowRouter.get('/following/:userId', verifyToken, getUserFollowing);

module.exports = {
    followUnfollowRouter
}
