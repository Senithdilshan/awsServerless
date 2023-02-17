const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = process.env.USERMANAGETABLE;
const index = process.env.EMAILINDEX;
const URL = process.env.PASSWORDRESETURL;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const userModel = {
    addUser: async (user) => {
        console.log(user);
        // console.log(table,index);
        let userold;
        try {
            const result = await dynamodb.query({
                TableName: table,
                IndexName: index,
                KeyConditionExpression: "email = :email",
                ExpressionAttributeValues: {
                    ':email': user.email
                }
            }).promise()
            console.log(result.Items);
            userold = result.Items[0]
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

        if (!userold) {
            try {
                await dynamodb.put({
                    TableName: table,
                    Item: user
                }).promise();
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
        }
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

    },

    getAll: async () => {
        let users;

        try {
            const results = await dynamodb.scan({ TableName: table }).promise()
            users = results.Items
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 200,
                body: JSON.stringify(users),
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
    },

    getById: async (id) => {
        let user;

        try {
            const result = await dynamodb.get({
                TableName: table,
                Key: { id }
            }).promise()
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
    },

    delete: async (id) => {
        try {
            await dynamodb.delete({
                TableName: table,
                Key: { id }
            }).promise();
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
    },

    login: async (email, password) => {
        let hashedPassword;
        let user;
        try {
            const result = await dynamodb.query({
                TableName: table,
                IndexName: index,
                KeyConditionExpression: "email = :email",
                ExpressionAttributeValues: {
                    ':email': email
                }

            }).promise()
            user = result.Items[0];
            hashedPassword = result.Items[0].password;
            const comparedPass = bcrypt.compareSync(password, hashedPassword);
            if (comparedPass) {
                const accessToken = jwt.sign({
                    userName: user.userName,
                    UserEmail: user.email,
                }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1d'
                })
                console.log(accessToken)
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 200,
                    body: JSON.stringify({
                        msg: "login Success",
                        accessToken: accessToken
                    }),
                };
            }
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                statusCode: 401,
                body: JSON.stringify({
                    msg: "Password does not match"
                }),
            };
        } catch (error) {
            console.log(error);
            return {
                headers: {
                    'Access-Control-Allow-Origin': URL,
                    'Access-Control-Allow-Credentials': true,
                },
                error,
                statusCode: 400,
                body: JSON.stringify({
                    msg: "login failed"
                }),
            };
        }
    },

    sendEmail: async (email) => {
        let user;
        try {
            const result = await dynamodb.query({
                TableName: table,
                IndexName: index,
                KeyConditionExpression: "email = :email",
                ExpressionAttributeValues: {
                    ':email': email
                }

            }).promise()
            // console.log(result.Items);
            user = result.Items[0]
            if (!user) {
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 404,
                    body: JSON.stringify({
                        msg: "user NotFound"
                    }),
                };
            } else {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dealzsuperproject@gmail.com',
                        pass: 'rwsnwviflkvrpkfi'
                    }
                });
                return transporter.sendMail({
                    from: 'dealzsuperproject@gmail.com',
                    to: user.email,
                    subject: 'Password Reset',
                    text: `It seems like you forgot your password ${user.userName}. \nIf this is true, click the link below to reset your password.\nReset my password [ ${URL}/updatePassword/${user.id} ]\n\n\nIf you did not forget your password, please disregard this email.`
                }).then(results => {
                    console.log("Success", results);
                    return {
                        headers: {
                            'Access-Control-Allow-Origin': URL,
                            'Access-Control-Allow-Credentials': true,
                        },
                        statusCode: 200,
                        body: JSON.stringify("Email Sent successfully"),
                    };
                }).catch(error => {
                    console.log(error);
                    return {
                        headers: {
                            'Access-Control-Allow-Origin': URL,
                            'Access-Control-Allow-Credentials': true,
                        },
                        statusCode: 400,
                        body: JSON.stringify("Email Sent Unsuccessful"),
                    };
                })

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
                    msg: "Invalid email address"
                }),
            };
        }
    },

    updatePassword: async (id, hashedPassword) => {
        let user;
        try {
            const result = await dynamodb.get({
                TableName: table,
                Key: { id }
            }).promise()
            user = result.Item
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
        if (user) {
            try {
                await dynamodb.update({
                    TableName: table,
                    Key: { id },
                    UpdateExpression: 'SET password=:password',
                    ExpressionAttributeValues: {
                        ':password': hashedPassword
                    },
                    ReturnValues: "ALL_NEW"
                }).promise();
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 200,
                    body: JSON.stringify({
                        msg: "Password updated successfully"
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
                    body: JSON.stringify({ msg: error }),
                };

            }
        }
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 404,
            body: JSON.stringify({
                msg: "user not found"
            }),
        };
    },

    updateUser: async (id, userName, email) => {
        let user;
        try {
            const result = await dynamodb.get({
                TableName: table,
                Key: { id }
            }).promise()
            user = result.Item
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
        if (user) {
            try {
                await dynamodb.update({
                    TableName: table,
                    Key: { id },
                    UpdateExpression: 'SET userName=:userName,email=:email',
                    ExpressionAttributeValues: {
                        ':userName': userName,
                        ':email': email
                    },
                    ReturnValues: "ALL_NEW"
                }).promise();
                return {
                    headers: {
                        'Access-Control-Allow-Origin': URL,
                        'Access-Control-Allow-Credentials': true,
                    },
                    statusCode: 200,
                    body: JSON.stringify({
                        msg: "user successfully updated"
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
                        msg: "user update failed"
                    }),
                };

            }
        }
        return {
            headers: {
                'Access-Control-Allow-Origin': URL,
                'Access-Control-Allow-Credentials': true,
            },
            statusCode: 404,
            body: JSON.stringify({
                msg: "user not found"
            }),
        };
    },

}

export default userModel;