import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD,
    },
});

const sendEmail = async ({to, subject, text}) => {
    const response = await transporter.sendMail({
        from: process.env.SENDER_EMAIL, // sender address
        to, // list of receivers
        subject, // Subject line
        html: body, // html body
    })
};

export default sendEmail;