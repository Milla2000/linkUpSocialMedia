const { Router } = require('express');
const resetPasswordController = require('../EmailService/resetPwdUser');

const resetPwd = Router()

// Route to display the password reset form

resetPwd.post("/resetPassword", resetPasswordController.sendPasswordResetEmail);



// Route to handle the password reset form submission
resetPwd.post("/updatePassword", resetPasswordController.updatePassword);


module.exports = {
    resetPwd
}
