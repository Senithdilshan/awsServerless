import userModel from '../Models/userModel';
const nodemailer = require('nodemailer');
const URL = process.env.PASSWORDRESETURL;

const sendEmail = async (event) => {
    const { email } = JSON.parse(event.body);
    if (!email) {
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 400,
            body: JSON.stringify({
                msg: "Can not be empty"
            }),
        };
    }
    let user;
    const result = await userModel.isoldUser(email);
    try {
        user = result.Items[0];
        if (!user) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 404,
                body: JSON.stringify({
                    msg: "user NotFound"
                }),
            };
        } else {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dealzsuperproject@gmail.com',
                    pass: 'rwsnwviflkvrpkfi'
                }
            });
            return transporter.sendMail({
                from: 'dealzsuperproject@gmail.com',
                to: user.email,
                subject: 'Password Reset',
                text: `It seems like you forgot your password ${user.userName}. \nIf this is true, click the link below to reset your password.\nReset my password [ ${URL}/updatePassword/${user.id} ]\n\n\nIf you did not forget your password, please disregard this email.`
            }).then(results => {
                console.log("Success", results);
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 200,
                    body: JSON.stringify("Email Sent successfully"),
                };
            }).catch(error => {
                console.log(error);
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 400,
                    body: JSON.stringify("Email Sent Unsuccessful"),
                };
            })

        }
    } catch (error) {
        console.log(error);
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 400,
            body: JSON.stringify({
                msg: "Invalid email address"
            }),
        };
    }
};
export default sendEmail;
