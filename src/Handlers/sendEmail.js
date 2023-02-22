import userModel from '../Models/userModel';
import Notification from '../Notification/sendEmail';
// const nodemailer = require('nodemailer');
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

            const data={
                to: user.email,
                subject: 'Password Reset',
                text: `It seems like you forgot your password ${user.userName}. \nIf this is true, click the link below to reset your password.\nReset my password [ ${URL}/updatePassword/${user.id} ]\n\n\nIf you did not forget your password, please disregard this email.`
            }

            try {
                await Notification.sendEmail(data);
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 200,
                    body: JSON.stringify("Email Sent successfully"),
                };
            } catch (error) {
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 400,
                    body: JSON.stringify("Email Sent Unsuccessful"),
                };
            }

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
