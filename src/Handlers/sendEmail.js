import userModel from '../Models/userModel';
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
    return await userModel.sendEmail(email);
};
export default sendEmail;
