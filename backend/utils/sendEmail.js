const nodeMailer = require("nodemailer");


// options is the object we send in the res
const sendEmail = async (options)=>{


    // this is the user/owner of the app who will send the mail to the user to authorize the further process by the mail requirements
    const transporter = nodeMailer.createTransport({
        // what king of service gmail or what - it is temporary
        // host:process.env.SMPT_HOST,
        // port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,// smpt simple mail transfer protocol just a fancy name
            pass:process.env.SMPT_PASSWORD,
        },
    });


    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }

    // this will send our mail
    await  transporter.sendMail(mailOptions);

};


module.exports = sendEmail;