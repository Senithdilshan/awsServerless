const nodemailer = require('nodemailer');
const Notification={
    sendEmail:async (data)=>{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dealzsuperproject@gmail.com',
                pass: 'rwsnwviflkvrpkfi'
            }
        });

        return transporter.sendMail({
            from: 'dealzsuperproject@gmail.com',
            to: data.to,
            subject:data.subject,
            text:data.text
        })
    }
}

export default Notification