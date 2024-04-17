/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 11/06/2023 19:31:47
 */

const fs = require('fs')
const moment = require('moment')
const MessageModel = require('../models/messageModel.js');


/**
 * messageController.js
 *
 * @description :: Server-side logic for managing messages.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * messageController.getMessages()
     */
    getMessagesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await MessageModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let messages = await MessageModel.find({})
                .populate("sender")
                .populate("ownership")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            messages = messages.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: messages.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: messages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting message.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * messageController.getMessages()
     */
    getMessages: async (req, res) => {
        try {
            const messages = await MessageModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: messages.length,
                results: messages,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting message.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * messageController.showMessageById()
     */
    searchMessageByTag: async (req, res) => {
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

            let allCount = await MessageModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let messages = await MessageModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            messages = messages.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                filter: req.query,
                resultCount: allCount,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: messages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting message.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * messageController.showMessageById()
         */
        showMessageById: async (req, res) => {
            try {
                const id = req.params.id;
                const message = await MessageModel.findOne({ _id: id })

                if (!message) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such message',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: message,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting message.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * messageController.showMessageById()
         */
        showMessageBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const message = await MessageModel.findOne({ slug: slug })

                if (!message) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such message',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: message,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting message.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
        },

            /**
             * Generate By Mudey Formation (https://mudey.fr)
             * messageController.createMessage()
             */
            createMessage: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var message = JSON.parse(req.body.message)
                    } else {
                        var { message
                    } = req.body
                }

        message = typeof (message) === "string" ? JSON.parse(message) : message
                console.log(req.body)

                if (!message) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of message.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(message).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty message !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/message", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/message/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    message.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/message/${file.filename}`
                   
                }

                message = new MessageModel({ ...message })

                message.created_at = message?.created_at ? message.created_at : new Date()

                await message.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "message is saved !",
                message,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating message.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * messageController. updateMessageById()
     */
    updateMessageById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var message = JSON.parse(req.body.message)
        } else {
            var { message
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    message = typeof (message) == "string" ? JSON.parse(message) : message

    if (!message) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of message.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(message).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty message !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    if (req?.files?.length) {
        const file = req?.files[0]
        fs.mkdir(process.cwd() + "/public/assets/files/message", (err) => {
            if (err) console.log(err)
        })
        fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/message/${file.filename}`, function (err) {
            if (err) throw err
            console.log('Successfully renamed - moved!')
        })

        message.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/message/${file.filename}`
      
    }

    if (deleteFiles?.length) {
        deleteFiles.forEach(currentFileUrl =>{
            const filename = "public/assets/" + currentFileUrl.split('/assets/')[1];
            console.log({ filename });
            fs.unlink(filename, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });

        })
    }

    message.updated_at = message?.updated_at ? message.updated_at : new Date()

    delete message?._id
    await MessageModel.updateOne({ _id: id }, { ...message })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "message is updated !",
                message,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating message.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * messageController.sortMessageByPosition
     */
    sortMessageByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await MessageModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "message sorted !",
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
     * messageController.removeMessageById()
     */
    removeMessageById: async (req, res) => {
        try {
            var id = req.params.id;

            const message = await MessageModel.findOne({ _id: id }, { imageUrl: true })
            if (message) {
                // const old_image = message.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await MessageModel.deleteOne({ _id: id })


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
                message: 'Error when deleting message.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
