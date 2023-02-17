import userHandler from "./src/Handlers"
import authenticatoken from "./src/Middlewares/authentication"


export const addUser = async (event) => userHandler.addUser(event)
export const deleteUser = async (event) => await authenticatoken(event,null,userHandler.deleteUser(event))
export const getAll = async (event) => await authenticatoken(event,null,userHandler.getAll(event))
export const getById = async (event) => await authenticatoken(event,null,userHandler.getById(event))
export const login = async (event) => userHandler.login(event)
export const sendEmail = async (event) => userHandler.sendEmail(event)
export const updatePassword = async (event) => userHandler.updatePassword(event)
export const updateUser = async (event) => await authenticatoken(event,null,userHandler.updateUser(event))

