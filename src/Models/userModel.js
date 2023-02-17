const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = process.env.USERMANAGETABLE;
const index = process.env.EMAILINDEX;
const URL = process.env.PASSWORDRESETURL;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const userModel = {

    isoldUser: async (email) => {
        return await dynamodb.query({
            TableName: table,
            IndexName: index,
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ':email': email
            }
        }).promise()
    },

    addUser: async (user) => {
        return await dynamodb.put({
            TableName: table,
            Item: user
        }).promise();
    },

    getAll: async () => {
        return await dynamodb.scan({ TableName: table }).promise()
    },

    getById: async (id) => {
        return await dynamodb.get({
            TableName: table,
            Key: { id }
        }).promise()
    },

    delete: async (id) => {
        return await dynamodb.delete({
            TableName: table,
            Key: { id }
        }).promise();
    },

    updatePassword: async (id, hashedPassword) => {
        return await dynamodb.update({
            TableName: table,
            Key: { id },
            UpdateExpression: 'SET password=:password',
            ExpressionAttributeValues: {
                ':password': hashedPassword
            },
            ReturnValues: "ALL_NEW"
        }).promise();
    },

    updateUser: async (id, userName, email) => {
        return await dynamodb.update({
            TableName: table,
            Key: { id },
            UpdateExpression: 'SET userName=:userName,email=:email',
            ExpressionAttributeValues: {
                ':userName': userName,
                ':email': email
            },
            ReturnValues: "ALL_NEW"
        }).promise();
    },

}

export default userModel;