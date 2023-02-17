const jwt = require('jsonwebtoken');



async function authenticatoken(event, context, callback) {
    const authHeader = event.headers['Authorization']
    if (!authHeader) return { statusCode: 401 }
    let token = authHeader.split(' ')[1];
    if (token == null) return { statusCode: 401 }
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
        if (error) {
            console.log('JWT Error', error)
            return {
                statusCode: 403,
                body: JSON.stringify({
                    msg: "Unauthorized"
                }),
            }
        }
        return callback
    });
};

export default authenticatoken;