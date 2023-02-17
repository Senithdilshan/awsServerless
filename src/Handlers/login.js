import userModel from '../Models/userModel';
const login = async (event) => {
    const { email, password } = JSON.parse(event.body);

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
    return await userModel.login(email, password)

};
export default login;
