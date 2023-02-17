import userModel from '../Models/userModel';
const URL = process.env.PASSWORDRESETURL;

const getById = async (event) => {
    const { id } = event.pathParameters;
    let user;
    try {
        const result=await userModel.getById(id)
        user = result.Item
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 200,
                body: JSON.stringify(user),
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
export default getById;
