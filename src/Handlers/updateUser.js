import userModel from '../Models/userModel';
const Joi = require('joi')
const URL = process.env.PASSWORDRESETURL;

const updateUser = async (event) => {

    const { userName, email } = JSON.parse(event.body);
    const { id } = event.pathParameters;
    const userSchema = Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
    })
    const results = userSchema.validate(JSON.parse(event.body))
    if (results.error) {
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 400,
            body: JSON.stringify({ msg: "invalid credintials" }),
        };
    }
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
    if(user){
        try {
            await userModel.updateUser(id, userName, email);
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 200,
                body: JSON.stringify({
                    msg: "user successfully updated"
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
                    body: JSON.stringify({
                        msg: "user update failed"
                    }),
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
export default updateUser;