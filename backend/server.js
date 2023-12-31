const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

// const { welcomeAboard } = require('./EmailService/newUser');
// const cron = require('node-cron');
const { usersRouter } = require('./routes/usersRouter');
const { resetPwd } = require('./routes/resetPwdRoute');
const { followUnfollowRouter } = require('./routes/followersFollowingRoutes');
const { postsRouter } = require('./routes/postRoutes');
const { likeRouter } = require('./routes/likeAndUnlikeRoute');
const { commentsRouter } = require('./routes/commentsRoutes');
// const { welcomeAboard } = require('./EmailService/newUser');
// const resetPasswordController = require('./EmailService/resetPwdUser');




const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/friends', followUnfollowRouter)
app.use('/users', usersRouter)
app.use('/posts',  postsRouter)
app.use('/reset', resetPwd)
app.use('/likes', likeRouter)
app.use('/comments', commentsRouter )



app.use((err, req, res, next) => {
  res.json({ Error: err })
})



//node-mailer cron job here
// cron.schedule("*/900 * * * * *", async () => {
//   //runs every 5 seconds

//   console.log("running a task every 5 seconds");
//   await resetPasswordController();
//   console.log("called welcomeAboard");
// });


app.listen(4500, () => {
  console.log('server running on port 4500')
})