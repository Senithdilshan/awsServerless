import userModel from '../Models/userModel';
const URL = process.env.PASSWORDRESETURL;
const deleteUser = async (event) => {
    const { id } = event.pathParameters;
    try {
        await userModel.delete(id)
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 200,
            body: JSON.stringify({
                msg: "user successfully deleted"
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
                    msg: "Delete Failed"
                }, null),
            };
    }
    
};
export default deleteUser;
