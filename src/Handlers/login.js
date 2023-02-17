import userModel from '../Models/userModel';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const URL = process.env.PASSWORDRESETURL;

const login = async (event) => {
    const { email, password } = JSON.parse(event.body);
    let hashedPassword;
    let user;

    if (!email || !password) {
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
    try {
        const result = await userModel.isoldUser(email);
        user = result.Items[0];
        if (user) {
            hashedPassword = result.Items[0].password;
            const comparedPass = bcrypt.compareSync(password, hashedPassword);
            if (comparedPass) {
                const accessToken = jwt.sign({
                    userName: user.userName,
                    UserEmail: user.email,
                }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1d'
                })
                console.log(accessToken)
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 200,
                    body: JSON.stringify({
                        msg: "login Success",
                        accessToken: accessToken
                    }),
                };
            }
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 401,
                body: JSON.stringify({
                    msg: "Password does not match"
                }),
            };
        }
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
    } catch (error) {
        console.log(error);
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            error,
            statusCode: 400,
            body: JSON.stringify({
                msg: "login failed"
            }),
        };
    }

};
export default login;
