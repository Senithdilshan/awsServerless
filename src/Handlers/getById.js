import userModel from '../Models/userModel';

const getById = async (event) => {
    const { id } = event.pathParameters;
    return await userModel.getById(id)
    
};
export default getById;
