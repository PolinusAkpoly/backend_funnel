/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 18:35:24
 */
const moment = require('moment')
const bcrypt = require('bcrypt')
const UserModel = require('../models/userModel.js');
const profileModel = require('../models/profileModel.js');
const jwt = require('jsonwebtoken');
const { sendNodeMail } = require('../helpers/sendmailer.js');
const email_templateModel = require('../models/email_templateModel.js');
const { eventEmitter } = require('../Event/emailEvent.js');
const friend_requestModel = require('../models/friend_requestModel.js');
const { updateFriend, generateRandomCode } = require('../helpers/utils.js');
const randomToken = require('random-token');
const authenticatorMutifactorModel = require('../models/authenticatorMutifactorModel.js');
const verifyEmailModel = require('../models/verifyEmailModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.signupUser()
     */
    signupUser: async (req, res, next) => {

        try {
            let {
                civility,
                firstname,
                lastname,
                fullname,
                phone,
                receivePromoMessage,
                email,
                password,
                dayBirth,
                monthBirth,
                yearBirth,
                created_at } = req.body

            firstname = firstname ? firstname.toUpperCase() : null
            lastname = lastname ? lastname[0].toUpperCase() + lastname.slice(1) : null
            fullname = fullname ? fullname[0].toUpperCase() + fullname.slice(1) : null
            // REGEX for E-mail validation
            const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/

            if (firstname === '' || firstname == null) {
                firstname = fullname ? fullname.split(" ")[0] : ""
            }
            if (lastname === '' || lastname == null) {
                lastname = fullname ? fullname.split(" ")[1] : ""
            }
            if (email === '' || email == null || !reg.test(email)) {
                return res.status(422).json({
                    statusCode: 422,
                    message: 'Error format email !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }
            fullname = fullname ? fullname : firstname + ' ' + lastname
            if (password.length < 6 || password == null) {
                return res.status(422).json({
                    statusCode: 422,
                    message: 'Password length must be 5 characters!',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }

            const userEmailExist = await UserModel.findOne({ email: email })

            if (userEmailExist) {
                return res.status(422).json({
                    statusCode: 422,
                    message: 'This email is used. Please, change and try again !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }
            // If username or email is not used
            bcrypt.hash(password, 10, async (err, password) => {
                if (err) {
                    return res.status(500).json({
                        statusCode: 500,
                        'message': "Error server, please try again !",
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    })
                }

                const user = new UserModel({ civility, fullname, firstname, lastname, email, phone, password, created_at })

                const profile = new profileModel({
                    business_name: "",
                    function: "",
                    description: "",
                    address: "",
                    hours: [],
                    website: "",
                    picture: "",
                    dayBirth,
                    monthBirth,
                    yearBirth,
                    user: user._id
                })




                user.profile = profile._id

                if(user.email == 'eakpoli@gmail.com'){
                    user.roles = ["ROLE_USER", "ROLE_ADMIN"]
                }else{
                    user.roles = ["ROLE_USER"]
                }

                // const token = randomToken(152);
                // user.verifyAccountToken = token
                // user.verifyAccountExpires = Date.now() + 3600000

                // if (networkInformation.status !== "fail") {
                //     user.networkInformation = networkInformation
                // }
                await user.save()
                await profile.save()

                // Welcome Email
                // const data = await getClientData(req)
                // emailSender.welcomeuser(user, data)

                // ///verify Account
                // emailSender.verifyEmail(user, data)
                eventEmitter.emit('signup', user, req)
                // let template = await email_templateModel.findOne({title: "Inscription"})
                //                                 .populate("fileUrls")
                // sendNodeMail(user, template)

                res.status(200).json({
                    statusCode: 200,
                    isSuccess: true,
                    message: 'Signup success.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })

            })



        } catch (error) {

            //console.log(error)

            res.status(500).json({
                statusCode: 500,
                isSuccess: false,
                message: "Error server, please try again !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
        }
    },
    signupAndAuthenticateUser: async (req, res, next) => {

        try {
            let {
                civility,
                firstname,
                lastname,
                fullname,
                phone,
                receivePromoMessage,
                email,
                password,
                dayBirth,
                monthBirth,
                yearBirth,
                created_at } = req.body

            firstname = firstname ? firstname.toUpperCase() : null
            lastname = lastname ? lastname[0].toUpperCase() + lastname.slice(1) : null
            fullname = fullname ? fullname[0].toUpperCase() + fullname.slice(1) : null
            // REGEX for E-mail validation
            const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/

            fullname = fullname ? fullname : firstname + ' ' + lastname
            if (firstname === '' || firstname == null) {
                firstname = fullname.split(" ")[0]
            }
            if (lastname === '' || lastname == null) {
                lastname = fullname.split(" ")[1]
            }
            if (email === '' || email == null || !reg.test(email)) {
                return res.status(422).json({
                    status: 422,
                    message: 'Error format email !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }
            if (password.length < 6 || password == null) {
                return res.status(422).json({
                    status: 422,
                    message: 'Password length must be 5 characters!',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }

            const userEmailExist = await UserModel.findOne({ email: email })

            if (userEmailExist) {
                return res.status(422).json({
                    status: 422,
                    message: 'This email is used. Please, change and try again !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }
            // If username or email is not used
            bcrypt.hash(password, 10, async (err, password) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        'message': "Error server, please try again !",
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    })
                }

                const user = new UserModel({ civility, fullname, firstname, lastname, email, phone, password, created_at })

                const profile = new profileModel({
                    business_name: "",
                    function: "",
                    description: "",
                    address: "",
                    hours: [],
                    website: "",
                    picture: "",
                    dayBirth,
                    monthBirth,
                    yearBirth,
                    user: user._id
                })




                user.profile = profile._id

                user.roles = ["ROLE_USER"]

                // const token = randomToken(152);
                // user.verifyAccountToken = token
                // user.verifyAccountExpires = Date.now() + 3600000

                // if (networkInformation.status !== "fail") {
                //     user.networkInformation = networkInformation
                // }
                await user.save()
                await profile.save()

                // Welcome Email
                // const data = await getClientData(req)
                // emailSender.welcomeuser(user, data)

                // ///verify Account
                // emailSender.verifyEmail(user, data)
                eventEmitter.emit('signup', user, req)
                // let template = await email_templateModel.findOne({title: "Inscription"})
                //                                 .populate("fileUrls")
                // sendNodeMail(user, template)

                // res.status(200).json({
                //     status: 200,
                //     isSuccess: true,
                //     message: 'Signup success.',
                //     request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                // })
                module.exports.authenticate(req, res)

            })



        } catch (error) {

            //console.log(error)

            res.status(500).json({
                status: 500,
                isSuccess: false,
                message: "Error server, please try again !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
        }
    },

    signinUser: async (req, res) => {
        try {

            const user = await UserModel.findOne({ email: req.body.email })

            // console.log({user});

            if (!user) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'User not found !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            bcrypt.compare(req.body.password, user.password, async (err, valid) => {
                if (err) {
                    return res.status(500).json({
                        isSuccess: false,
                        statusCode: 500,
                        message: err.message,
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }
                if (!valid) {
                    return res.status(401).json({
                        isSuccess: false,
                        statusCode: 401,
                        message: "Bad Password !",
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }


                eventEmitter.emit('signin', user, req)



                return res.status(200).json({
                    isSuccess: true,
                    userId: user._id,
                    user: {
                        email: user.email,
                        fullname: user.fullname,
                        lastname: user.lastname,
                        firstname: user.firstname,
                        roles: user.roles,
                    },
                    token: jwt.sign(
                        { userId: user._id, email: user.email },
                        process.env.TOKEN_SECRET,
                        { expiresIn: process.env.TOKEN_EXPIRATION }
                    )
                })

            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

    },
    authenticate: async (req, res) => {
        try {
            console.log(req.body);
            const user = await UserModel.findOne({ email: req.body.email })

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            const valid = await bcrypt.compare(req.body.password, user.password)

            if (!valid) {
                return res.status(401).json({
                    isSuccess: false,
                    status: 401,
                    message: "Bad Password !",
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            const partial_token = randomToken(152)

            await authenticatorMutifactorModel.deleteMany({ userId: user._id })

            let code

            if (user.email === "playstore@test.com") {
                code = "142585"
            } else {
                code = generateRandomCode(6)
            }

            const authenticator = new authenticatorMutifactorModel({
                userId: user._id,
                code: code,
                partial_token: partial_token,
                createdAt: new Date()
            })

            console.log({
                userId: user._id,
                code: code,
                partial_token: partial_token,
                // expiredAt: Date,
                createdAt: new Date()
            });

            await authenticator.save()

            req.code = code

            eventEmitter.emit('authenticate', user, req)



            return res.status(200).json({
                isSuccess: true,
                userId: user._id,
                partial_token,
            })


        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

    },
    authenticateEmail: async (req, res) => {
        try {
            console.log(req.body);
            const user = await UserModel.findOne({ email: req.body.email })

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            const partial_token = randomToken(152)

            await verifyEmailModel.deleteMany({ userId: user._id })

            let code

            if (user.email === "playstore@test.com") {
                code = "142585"
            } else {
                code = generateRandomCode(6)
            }

            const createdAt = new Date();

            const authenticator = new verifyEmailModel({
                userId: user._id,
                code: code,
                partial_token: partial_token,
                createdAt: createdAt
            })

            console.log({
                userId: user._id,
                code: code,
                partial_token: partial_token,
                expiredAt: new Date(createdAt.getTime() + 60 * 60 * 1000),
                createdAt: createdAt
            });

            await authenticator.save()

            req.code = code

            eventEmitter.emit('verifyEmail', user, req)



            return res.status(200).json({
                isSuccess: true,
                userId: user._id,
                partial_token,
            })


        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

    },
    verifyAuthenticateToken: async (req, res) => {
        try {
            const { partial_token } = req.body



            const authenticate = await authenticatorMutifactorModel.findOne({ partial_token: partial_token })

            //console.log(authenticate);

            if (!authenticate) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }

            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: 'Authentication token successful'
            })


        } catch (error) {
            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error
            })
        }
    },

    verifyCode: async (req, res) => {
        try {
            const { partial_token, code } = req.body

            console.log({ partial_token, code })

            const authenticate = await authenticatorMutifactorModel.findOne({
                partial_token: partial_token,
                code: code
            })



            if (!authenticate) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }

            const user = await UserModel.findOne({ _id: authenticate.userId })

            if (!user) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }

            const payLoad = {
                _id: user._id,
                userId: user._id,
                email: user.email,
                fullname: user.fullname
            }

            // Options for the token
            const jwtOptions = {
                expiresIn: process.env.TOKEN_EXPIRATION
            }

            // Generate the token
            const token = jwt.sign(payLoad, process.env.JWT_SECRET, jwtOptions)

            res.cookie("t", token, {
                expire: new Date() + 9999
            })
            if (process.env.NODE_ENV !== "development") {
                // const data = await getClientData(req)
                // emailSender.newConnexion(user, data)
            }
            // Send the token
            user.lastConnected = new Date()
            user.online = true
            // if (!user.newConnexion?.status) {
            //     const networkInformation = await getIpData(req)
            //     if (networkInformation.status !== "fail") {
            //         user.networkInformation = networkInformation
            //     }
            // }

            authenticatorMutifactorModel.deleteOne({ partial_token: partial_token, code: code })

            return res.status(200).json({
                status: 200,
                isSuccess: true,
                userId: user._id,
                email: user.email,
                auth_token: token,
                user: {
                    _id: user._id,
                    civility: user.civility,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    website: user.website,
                    publicinfo: user.publicinfo,
                    roles: user.roles,
                    email: user.email,
                    username: user.username,
                    fullname: user.fullname
                },
                message: 'Authentication successful'
            })


        } catch (error) {
            console.log({ error });
            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error
            })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { reset_password_token, password } = req.body



            const authenticate = await verifyEmailModel.findOne({
                reset_password_token: reset_password_token,
                isVerified: true
            })



            if (!authenticate) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }

            const user = await UserModel.findOne({ _id: authenticate.userId })

            if (!user) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }

            const passwordHash = await bcrypt.hash(password, 10)

            user.password = passwordHash

            await user.save()

            const payLoad = {
                _id: user._id,
                userId: user._id,
                email: user.email,
                username: user.username,
                fullname: user.fullname
            }

            // Options for the token
            const jwtOptions = {
                expiresIn: process.env.TOKEN_EXPIRATION
            }

            // Generate the token
            const token = jwt.sign(payLoad, process.env.JWT_SECRET, jwtOptions)

            res.cookie("t", token, {
                expire: new Date() + 9999
            })
            if (process.env.NODE_ENV !== "development") {
                // const data = await getClientData(req)
                // emailSender.newConnexion(user, data)
            }
            // Send the token
            user.lastConnected = new Date()
            user.online = true
            // if (!user.newConnexion?.status) {
            //     const networkInformation = await getIpData(req)
            //     if (networkInformation.status !== "fail") {
            //         user.networkInformation = networkInformation
            //     }
            // }

            verifyEmailModel.deleteOne({
                reset_password_token: reset_password_token,
                isVerified: true
            })

            eventEmitter.emit('ConfirmPassword', user, req)

            return res.status(200).json({
                status: 200,
                isSuccess: true,
                userId: user._id,
                email: user.email,
                auth_token: token,
                token: token,
                user: {
                    _id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    roles: user.roles,
                },
                message: 'Authentication successful'
            })


        } catch (error) {
            console.log({ error });
            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error
            })
        }
    },
    verifyEmailCode: async (req, res) => {
        try {
            const { partial_token, code } = req.body

            console.log({ partial_token, code })

            const authenticate = await verifyEmailModel.findOne({
                partial_token: partial_token,
                code: code
            })



            if (!authenticate) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }

            const user = await UserModel.findOne({ _id: authenticate.userId })

            if (!user) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }

            const reset_password_token = randomToken(152)


            const t = await verifyEmailModel.updateOne({ partial_token: partial_token, code: code }, {
                isVerified: true,
                reset_password_token: reset_password_token
            })
            console.log({ t });

            return res.status(200).json({
                status: 200,
                isSuccess: true,
                userId: user._id,
                email: user.email,
                reset_password_token,
                message: 'Authentication successful'
            })


        } catch (error) {
            console.log({ error });
            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error
            })
        }
    },
    resendCode: async (req, res) => {
        try {
            const { partial_token } = req.body



            const authenticate = await authenticatorMutifactorModel.findOne({ partial_token: partial_token })



            if (!authenticate) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }


            console.log(authenticate);


            const { userId, code } = authenticate

            req.code = code

            const user = await UserModel.findOne({ _id: userId })

            eventEmitter.emit('authenticate', user, req)

            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: 'Code resended !'
            })


        } catch (error) {
            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error
            })
        }
    },
    resendVerifyEmailCode: async (req, res) => {
        try {
            const { partial_token } = req.body



            const authenticate = await verifyEmailModel.findOne({ partial_token: partial_token })



            if (!authenticate) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    message: "The code you entered is invalid. Try Again."
                })
            }


            console.log(authenticate);


            const { userId, code } = authenticate
            req.code = code
            const user = await UserModel.findOne({ _id: userId })



            eventEmitter.emit('verifyEmail', user, req)




            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: 'Code resended !'
            })


        } catch (error) {
            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error
            })
        }
    },
    /**
     * @param {""} userId of user
     */
    verifyAuthToken: async (req, res, next) => {
        try {

            const { token, userId } = req.body

            console.log({ token, userId });

            const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log({ decodeToken });

            if (userId && userId !== decodeToken.userId) {
                return res.status(401).json({
                    statusCode: 401,
                    isSuccess: false,
                    message: 'Invalid User ID !'
                })
            } else {
                const user = await UserModel.findOne({ email: decodeToken.email }, {
                    civility: true,
                    firstname: true,
                    lastname: true,
                    fullname: true,
                    username: true,
                    email: true,
                    publicinfo: true,
                    roles: true
                })

                return res.status(200).json({
                    statusCode: 200,
                    isSuccess: true,
                    user,
                    message: 'Auth Token Valid !'
                })
            }

        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                isSuccess: false,
                message: err.message
            })
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.getUsersByPage()
     */
    getUsersByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await UserModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                pageNumber = Math.ceil(allCount / pageLimit)
            }

            let users = await UserModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            users = users.map((item) => {
                item.password = ""
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: users.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: users.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            //console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.getUsers()
     */
    getUsers: async (req, res) => {
        try {
            const users = await UserModel.find({}, { password: false })
                .populate("profile")

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: users.length,
                results: users,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            //console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    getUserFiends: async (req, res) => {
        try {
            const filters = []
            console.log({ params: req.params })
            const userId = req.params.userId
            const requests = await friend_requestModel.find({
                $or: [
                    {
                        senderId: userId,
                        statusCode: "ACCEPT"
                    },
                    {
                        ownerId: userId,
                        statusCode: "ACCEPT"
                    },
                ]
            })
            await Promise.all(requests.map((request) => {
                const id = request.ownerId == userId ? request.senderId : request.ownerId
                filters.push(id)
            }))
            const pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            const pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 10



            let allCount = await UserModel.find({ _id: { $in: filters } }, { password: false }).count()
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let users = await UserModel.find({ _id: { $in: filters } }, { password: false, email: false, roles: false, tags: false })
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .populate("profile")
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            users = await Promise.all(users.map(async (user) => {
                // console.log({
                //     ownerId: req.userId,
                //     senderId: user._id,
                // });
                await updateFriend(req.userId)
                await updateFriend(user._id)
                const has_friend_request = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                        },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                        },
                    ]
                })
                const request_received = await friend_requestModel.findOne({
                    $or: [
                        // {
                        //     ownerId: req.userId,
                        //     senderId: user._id,
                        // },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                            statusCode: "ASQ"
                        },
                    ]
                })
                const request_sended = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                            statusCode: "ASQ"
                        },
                        // {
                        //     ownerId: user._id,
                        //     senderId: req.userId,
                        //     statusCode: "ASQ"
                        // },
                    ]
                })
                const is_my_friend = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                            statusCode: "ACCEPT"
                        },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                            statusCode: "ACCEPT"
                        },
                    ]
                })
                user.has_friend_request = has_friend_request ? true : false
                user.request_received = request_received ? true : false
                user.request_sended = request_sended ? true : false
                user.is_my_friend = is_my_friend ? true : false


                return user
            }))



            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: users.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.showUserById()
     */
    searchUserByTag: async (req, res) => {
        try {

            let filter = {}
            const pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            const pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 10

            const fullname = req.query?.fullname ? new RegExp(req.query.fullname, 'i') : null
            const firstname = req.query?.firstname ? new RegExp(req.query.firstname, 'i') : null
            const lastname = req.query?.lastname ? new RegExp(req.query.firstname, 'i') : null
            const email = req.query?.email ? new RegExp(req.query.firstname, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if (fullname) {
                filter.fullname = fullname
            }
            if (firstname) {
                filter.firstname = firstname
            }
            if (lastname) {
                filter.lastname = lastname
            }
            if (startDate) {
                filter.created_at = { $gt: startDate }
            }

            if (endDate) {
                if (filter.created_at) {
                    filter.created_at = { ...filter.created_at, $lt: endDate }
                } else {
                    filter.created_at = { $lt: endDate }
                }
            }

            let allCount = await UserModel.find(filter, { password: false }).count()
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let users = await UserModel.find(filter, { password: false, email: false, roles: false, tags: false })
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .populate("profile")
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            users = await Promise.all(users.map(async (user) => {
                console.log({
                    ownerId: req.userId,
                    senderId: user._id,
                });
                await updateFriend(req.userId)
                await updateFriend(user._id)
                const has_friend_request = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                        },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                        },
                    ]
                })
                const request_received = await friend_requestModel.findOne({
                    $or: [
                        // {
                        //     ownerId: req.userId,
                        //     senderId: user._id,
                        // },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                            statusCode: "ASQ"
                        },
                    ]
                })
                const request_sended = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                            statusCode: "ASQ"
                        },
                        // {
                        //     ownerId: user._id,
                        //     senderId: req.userId,
                        //     statusCode: "ASQ"
                        // },
                    ]
                })
                const is_my_friend = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                            statusCode: "ACCEPT"
                        },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                            statusCode: "ACCEPT"
                        },
                    ]
                })
                user.has_friend_request = has_friend_request ? true : false
                user.request_received = request_received ? true : false
                user.request_sended = request_sended ? true : false
                user.is_my_friend = is_my_friend ? true : false


                return user
            }))

            console.log({ user: req.user });

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                filter: req.query,
                allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: users.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            //console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.showUserById()
     */
    showUserById: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await UserModel.findOne({ _id: id }, { password: false })
                .populate("profile")
                .populate("friends")

            if (!user) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such user',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: user,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.createUser()
     */
    createUser: async (req, res) => {
        try {

            let { user } = req.body

            if (!user) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of user.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(user).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty user !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if(user.password && user.password.trim()){
                const passwordHash = await bcrypt.hash(user.password, 10)
                user.password = passwordHash
            }else{
                delete user?.password
            }

            user = new UserModel({ ...user })

            user.created_at = user?.created_at ? user.created_at : new Date()

            await user.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "user is saved !",
                user,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            //console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController. updateUserById()
     */
    updateUserById: async (req, res) => {
        try {
            const id = req.params.id;
            let { user } = req.body

            console.log(user);

            if (!user) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of user.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(user).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty user !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            user.updated_at = user?.updated_at ? user.updated_at : new Date()

            if(user.password && user.password.trim()){
                const passwordHash = await bcrypt.hash(user.password, 10)
                user.password = passwordHash
            }else{
                delete user?.password
            }
            delete user?._id
            await UserModel.updateOne({ _id: id }, { ...user })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "user is updated !",
                user,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.sortUserByPosition
     */
    sortUserByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await UserModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "user sorted !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            //console.log(error);

            return res.status(500).json({
                statusCode: 500,
                isSuccess: false,
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.removeUserById()
     */
    removeUserById: async (req, res) => {
        try {
            var id = req.params.id;

            await UserModel.deleteOne({ _id: id })


            return res.status(204).json({
                // 204 No Content
                // isSuccess: true,
                // statusCode: 204,
                // message: 'Data deleted ! .',
            });

        } catch (error) {
            //console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when deleting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
};
