import userModel from '../Models/userModel';
const bcrypt = require('bcryptjs')

const updatePassword = async (event) => {
    const { id, password } = JSON.parse(event.body);
    const salt = await bcrypt.genSalt();
    const hashedPassword = bcrypt.hashSync(password, salt);
    return await userModel.updatePassword(id,hashedPassword)
};
export default updatePassword;
