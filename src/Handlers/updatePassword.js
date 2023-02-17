import userModel from '../Models/userModel';
const bcrypt = require('bcryptjs')
const URL = process.env.PASSWORDRESETURL;

const updatePassword = async (event) => {
    const { id, password } = JSON.parse(event.body);
    const salt = await bcrypt.genSalt();
    const hashedPassword = bcrypt.hashSync(password, salt);
    let user;
    try {
        const result = await userModel.getById(id);
        user = result.Item
    } catch (error) {
        console.log(error);
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 400,
            body: JSON.stringify({
                msg: "user found failed"
            }),
        };
    }
    if (user) {
        try {
            await userModel.updatePassword(id, hashedPassword);
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 200,
                body: JSON.stringify({
                    msg: "Password updated successfully"
                }),
            };
        } catch (error) {
            console.log(error);
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 400,
                body: JSON.stringify({ msg: error }),
            };
        }
    }
    return {
        headers: {
            'Access-Control-Allow-Origin': URL,
            'Access-Control-Allow-Credentials': true,
        },
        statusCode: 404,
        body: JSON.stringify({
            msg: "user not found"
        }),
    };

};
export default updatePassword;
