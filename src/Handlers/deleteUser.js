import userModel from '../Models/userModel';
const deleteUser = async (event) => {
    const { id } = event.pathParameters;
    return await userModel.delete(id)
};
export default deleteUser;
