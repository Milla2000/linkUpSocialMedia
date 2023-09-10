const  nodeMailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

function createTransporter(config){
    return nodeMailer.createTransport(config)
};

let config = {
    host : 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER, //replace with your email in the .env file else you will get an error
        pass: process.env.EMAIL_PWD //replace with your password in the .env file else you will get an error
    }
}

const sendMail = async (messageOptions)=>{
    let transporter = createTransporter(config);
    await transporter.verify();
    await transporter.sendMail(messageOptions, (err, info)=>{
        console.log(info);
    });
};

module.exports = {
    sendMail
}