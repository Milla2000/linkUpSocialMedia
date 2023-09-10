const joi = require ('joi')

const loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().required()
})

const registerSchema = joi.object({
    //  username, email, password, phone_number 
    username: joi.string().min(5).required().unique(),
    email: joi.string().email().required().unique(),
    password: joi.string()
        .min(8)
        .required()
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) 
        // Requires at least 1 uppercase, 1 lowercase, and 1 number
        .message('Password must contain at least one uppercase letter, one lowercase letter, and one number')
})

module.exports = {
    loginSchema,
    registerSchema
}   