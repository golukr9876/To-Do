import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_ClIENT_ID,
        clientSecret: process.env.GOOGLE_ClIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify((error, success) => {
    if(error){
        console.log('Error connecting to email server: ', error);
    }
    else {
        console.log("Email server is ready to send message");
    }
})


export const sendMail = async(to, subject, text, html) => {
    try{
        const info = await transporter.sendMail({
            from: `"Task Flow" <${process.env.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch(error){
        console.log('Error sending email: ', error);
    }
}