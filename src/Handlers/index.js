import addUser from "./addUser";
import deleteUser from "./deleteUser";
import getAll from "./getAll";
import getById from "./getById";
import login from "./login";
import sendEmail from "./sendEmail";
import updatePassword from "./updatePassword";
import updateUser from "./updateUser";

const userHandler = {
    addUser,
    deleteUser,
    getAll,
    getById,
    login,
    sendEmail,
    updatePassword,
    updateUser
}

export default userHandler;