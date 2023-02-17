import userModel from "../Models/userModel";
const URL = process.env.PASSWORDRESETURL;

const getAll = async (event) => {
    let users;
    try {
        const results= await userModel.getAll();
        users = results.Items
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 200,
            body: JSON.stringify(users),
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
};
export default getAll;
