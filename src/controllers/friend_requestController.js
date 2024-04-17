/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/07/2023 15:01:18
 */

const fs = require('fs')
const moment = require('moment')
const Friend_requestModel = require('../models/friend_requestModel.js');


/**
 * friend_requestController.js
 *
 * @description :: Server-side logic for managing friend_requests.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * friend_requestController.getFriend_requests()
     */
    getFriend_requestsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await Friend_requestModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let friend_requests = await Friend_requestModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            friend_requests = friend_requests.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: friend_requests.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: friend_requests.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * friend_requestController.getFriend_requests()
     */
    getFriend_requests: async (req, res) => {
        try {
            const friend_requests = await Friend_requestModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: friend_requests.length,
                results: friend_requests,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    getReceiveFriend_requests: async (req, res) => {
        try {
            const friend_requests = await Friend_requestModel.find({
                senderId: req.userId,
                statusCode: "ASQ"
            }).populate({
                path: "ownerId",
                select: "fullName firstname lastname",
                options:{
                    populate: "profile"
                }
            })

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: friend_requests.length,
                results: friend_requests,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    getSendFriend_requests: async (req, res) => {
        try {
            const friend_requests = await Friend_requestModel.find({
                ownerId: req.userId,
                statusCode: "ASQ"
            }).populate({
                path: "senderId",
                select: "fullName firstname lastname",
                options:{
                    populate: "profile"
                }
            })

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: friend_requests.length,
                results: friend_requests,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    confirmFriend_requests: async (req, res) => {
        try {
            const requestId = req.params.requestId

            const friend_request = await Friend_requestModel.findOne({
                _id: requestId,
                senderId: req.userId
            })

            friend_request.status = "ACCEPT"

            await friend_request.save()

            updateFriend(friend_request.senderId)
            updateFriend(friend_request.ownerId)

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: 1,
                results: friend_request,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when confirming friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * friend_requestController.showFriend_requestById()
     */
    searchFriend_requestByTag: async (req, res) => {
        try {

            let filter = {}
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5



            const email = req.query?.email ? new RegExp(req.query.email, 'i') : null
            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const content = req.query?.content ? new RegExp(req.query.content, 'i') : null
            const description = req.query?.description ? new RegExp(req.query.content, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if (email) {
                filter.email = email
            }
            if (name) {
                filter.name = name
            }
            if (content) {
                filter.content = content
            }
            if (description) {
                filter.description = description
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

            let allCount = await Friend_requestModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let friend_requests = await Friend_requestModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            friend_requests = friend_requests.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })
            console.log({user: req.user});

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                filter: req.query,
                resultCount: allCount,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: friend_requests.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * friend_requestController.showFriend_requestById()
    */
    showFriend_requestById: async (req, res) => {
        try {
            const id = req.params.id;
            const friend_request = await Friend_requestModel.findOne({ _id: id })

            if (!friend_request) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such friend_request',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: friend_request,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
        * Generate By Mudey Formation (https://mudey.fr)
        * friend_requestController.showFriend_requestById()
        */
        showFriend_requestBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const friend_request = await Friend_requestModel.findOne({ slug: slug })

                if (!friend_request) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such friend_request',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: friend_request,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting friend_request.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * friend_requestController.createFriend_request()
    */
    createFriend_request: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var friend_request = JSON.parse(req.body.friend_request)
            } else {
                var { friend_request
                } = req.body
            }

            friend_request = typeof (friend_request) === "string" ? JSON.parse(friend_request) : friend_request

            // console.log(req.body)

            if (!friend_request) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of friend_request.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(friend_request).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty friend_request !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            //Upload single file
            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/friend_request", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/friend_request/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                friend_request.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/friend_request/${file.filename}`
            }


            // Upload many files
            // if (req?.files?.length) {
            //     req?.files.forEach(file => {
            //         fs.mkdir(process.cwd() + "/public/assets/files/friend_request", (err) => {
            //             if (err) console.log(err)
            //         })
            //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/friend_request/${file.filename}`, function (err) {
            //             if (err) throw err
            //             console.log('Successfully renamed - moved!')
            //         })
            //         
            //         friend_request.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/friend_request/${file.filename}`)
            //         
            //     });
            // }

            const isExist = await Friend_requestModel.findOne({
                $or: [
                    {
                        ownerId: friend_request.ownerId,
                        senderId: friend_request.senderId
                    },
                    {
                        ownerId: friend_request.senderId,
                        senderId: friend_request.ownerId
                    },

                ]
                // ownerId: { $in: [friend_request.ownerId, friend_request.senderId] },
                // senderId: { $in: [friend_request.ownerId, friend_request.senderId] }
            })

       
            if(isExist){
                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "friend_request is already saved !",
                    friend_request: isExist,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            
            friend_request = new Friend_requestModel({ ...friend_request })

            friend_request.status = "ASQ"
            friend_request.created_at = friend_request?.created_at ? friend_request.created_at : new Date()

            await friend_request.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "friend_request is saved !",
                friend_request,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * friend_requestController. updateFriend_requestById()
     */
    updateFriend_requestById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var friend_request = JSON.parse(req.body.friend_request)
            } else {
                var { friend_request
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            friend_request = typeof (friend_request) == "string" ? JSON.parse(friend_request) : friend_request

            if (!friend_request) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of friend_request.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(friend_request).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty friend_request !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            //Upload single file
            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/friend_request", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/friend_request/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                friend_request.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/friend_request/${file.filename}`
            }


            // Upload many files
            // if (req?.files?.length) {
            //     req?.files.forEach(file => {
            //         fs.mkdir(process.cwd() + "/public/assets/files/friend_request", (err) => {
            //             if (err) console.log(err)
            //         })
            //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/friend_request/${file.filename}`, function (err) {
            //             if (err) throw err
            //             console.log('Successfully renamed - moved!')
            //         })
            //         
            //         friend_request.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/friend_request/${file.filename}`)
            //         
            //     });
            // }

            if (deleteFiles?.length) {
                deleteFiles.forEach(currentFileUrl => {
                    const filename = "public/assets/" + currentFileUrl.split('/assets/')[1];
                    console.log({ filename });
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });

                })
            }

            friend_request.updated_at = friend_request?.updated_at ? friend_request.updated_at : new Date()

            delete friend_request?._id
            await Friend_requestModel.updateOne({ _id: id }, { ...friend_request })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "friend_request is updated !",
                friend_request,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * friend_requestController.sortFriend_requestByPosition
     */
    sortFriend_requestByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await Friend_requestModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "friend_request sorted !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

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
     * friend_requestController.removeFriend_requestById()
     */
    removeFriend_requestById: async (req, res) => {
        try {
            var id = req.params.id;

            const friend_request = await Friend_requestModel.findOne({ _id: id }, { imageUrl: true })
            if (friend_request) {
                // const old_image = friend_request.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await Friend_requestModel.deleteOne({ _id: id })


                return res.status(204).json({
                    // 204 No Content
                    // isSuccess: true,
                    // statusCode: 204,
                    // message: 'Data deleted ! .',
                });

            }

            return res.status(204).json({
                // 204 No Content
                // isSuccess: true,
                // statusCode: 204,
                // message: 'Data deleted ! .',
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when deleting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    removeSenderFriend_requestById: async (req, res) => {
        try {
            var senderId = req.params.senderId;

            await Friend_requestModel.deleteOne({
                $or: [
                    {
                        ownerId: req.userId,
                        senderId
                    },
                    {
                        ownerId: senderId,
                        senderId: req.userId
                    },
                ]
            })
            

            return res.status(204).json({
                // 204 No Content
                // isSuccess: true,
                // statusCode: 204,
                // message: 'Data deleted ! .',
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when deleting friend_request.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
