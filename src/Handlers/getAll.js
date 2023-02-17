import userModel from "../Models/userModel";

const getAll = async (event) => {
    return await userModel.getAll()
};
export default getAll;
