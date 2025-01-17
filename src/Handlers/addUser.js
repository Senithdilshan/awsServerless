import userModel from '../Models/userModel';
const { v4 } = require('uuid')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const URL = process.env.PASSWORDRESETURL;

const addUser = async (event, context) => {
  const { userName, email, password } = JSON.parse(event.body);

  const userSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
  })

  const results = userSchema.validate(JSON.parse(event.body))
  if (results.error) {
    return {
      headers: {
        'Access-Control-Allow-Origin': URL,
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 400,
      body: JSON.stringify({ msg: results.error }),
    };
  }
  const createdAt = new Date().toISOString();
  const id = v4();
  const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = {
    id: id,
    userName: userName,
    email: email,
    password: hashedPassword,
    createdAt
  }
  try {
    let userold;
    const olduser = await userModel.isoldUser(user.email);
    userold = olduser.Items[0]
    console.log(userold);
    if (!userold) {
      try {
        await userModel.addUser(user);
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
    } else {
      return {
        headers: {
          'Access-Control-Allow-Origin': URL,
          'Access-Control-Allow-Credentials': true,
        },
        statusCode: 400,
        body: JSON.stringify({
          msg: "user already exists"
        }),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      headers: {
        'Access-Control-Allow-Origin': URL,
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 400,
      body: JSON.stringify({
        msg: "user found failed"
      }),
    };
  }
};
export default addUser;