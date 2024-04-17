/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 18:35:24
 */

/**
 * Please : Install package jsonwebtoken => npm i jsonwebtoken
 */
const jwt = require('jsonwebtoken');
const moment = require('moment');
const UserModel = require('../models/userModel.js');

const getCookie = (req, cookieName) => {
    return req.cookies[cookieName];
};

const auth = async (req, res, next) => {
    try {



        const token = req.headers?.authorization?.split(' ')[1] || getCookie(req, "ouitube_token");


        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await UserModel.findOne({ _id: decodeToken.userId },
            {
                password: 0,
                verifyAccountToken: 0,
                verifyAccountExpires: 0,
                resetPasswordExpires: 0,
                resetPasswordToken: 0
            })


        if (req.body.userId && req.body.userId !== decodeToken.userId) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid User ID',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
        } else {
            req.userId = decodeToken?.userId
            req.user = user
            next()
        }

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Token not found !",
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        })
    }
}

const admin = async (req, res, next) => {
    try {
        //console.log("req.headers.authorization ",req.headers);

        const token = req.headers?.authorization?.split(' ')[1] || getCookie(req, "ouitube_token");


        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await UserModel.findOne({ _id: decodeToken.userId },
            {
                password: 0,
                verifyAccountToken: 0,
                verifyAccountExpires: 0,
                resetPasswordExpires: 0,
                resetPasswordToken: 0
            })

        //console.log(user)

        // const ip = requestIp.getClientIp(req)
        // let isAuthorizedIps = await authorizedIpModel.findOne({ ip: ip })

        // console.log(isAuthorizedIps);
        if (process.env.NODE_ENV !== "development") {
            // if (!isAuthorizedIps) {
            //     return res.status(401).json({
            //         status: 401,
            //         message: 'Not Authorization !'
            //     })
            // }

        }

        // console.log(user.roles);

        if (!user.roles.includes("ROLE_ADMIN")) {
            return res.status(401).json({
                status: 401,
                message: 'Not Authorization !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
        } else {
            //console.log("next");
            req.userId = decodeToken?._id
            req.userStatus = "ADMIN"
            next()
        }

    } catch (err) {
        //console.log(err);
        return res.status(500).json({
            status: 500,
            message: "Not Authorization !",
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        })
    }
}

module.exports = {
    auth,
    admin
}