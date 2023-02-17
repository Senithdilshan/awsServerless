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
    return await userModel.updateUser(id,userName,email);
};
export default updateUser;