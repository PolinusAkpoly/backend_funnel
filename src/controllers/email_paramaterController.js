/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 31/05/2023 16:58:00
 */

const fs = require('fs')
const moment = require('moment')
const Email_paramaterModel = require('../models/email_paramaterModel.js');


/**
 * email_paramaterController.js
 *
 * @description :: Server-side logic for managing email_paramaters.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * email_paramaterController.getEmail_paramaters()
     */
    getEmail_paramatersByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await Email_paramaterModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let email_paramaters = await Email_paramaterModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            email_paramaters = email_paramaters.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: email_paramaters.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: email_paramaters.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting email_paramater.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * email_paramaterController.getEmail_paramaters()
     */
    getEmail_paramaters: async (req, res) => {
        try {
            const email_paramaters = await Email_paramaterModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: email_paramaters.length,
                results: email_paramaters,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting email_paramater.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * email_paramaterController.showEmail_paramaterById()
     */
    searchEmail_paramaterByTag: async (req, res) => {
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

            let allCount = await Email_paramaterModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let email_paramaters = await Email_paramaterModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            email_paramaters = email_paramaters.map((item) => {
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
                results: email_paramaters.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting email_paramater.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * email_paramaterController.showEmail_paramaterById()
     */
    showEmail_paramaterById: async (req, res) => {
        try {
            const id = req.params.id;
            const email_paramater = await Email_paramaterModel.findOne({ _id: id })

            if (!email_paramater) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such email_paramater',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: email_paramater,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting email_paramater.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * email_paramaterController.showEmail_paramaterById()
         */
        showEmail_paramaterBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const email_paramater = await Email_paramaterModel.findOne({ slug: slug })

                if (!email_paramater) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such email_paramater',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: email_paramater,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting email_paramater.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * email_paramaterController.createEmail_paramater()
     */
    createEmail_paramater: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var email_paramater = JSON.parse(req.body.email_paramater)
            } else {
                var { email_paramater
                } = req.body
            }

            email_paramater = typeof (email_paramater) === "string" ? JSON.parse(email_paramater) : email_paramater
            console.log(req.body)

            if (!email_paramater) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of email_paramater.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(email_paramater).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty email_paramater !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/email_paramater", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/email_paramater/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                email_paramater.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/email_paramater/${file.filename}`

            }

            email_paramater = new Email_paramaterModel({ ...email_paramater })

            email_paramater.created_at = email_paramater?.created_at ? email_paramater.created_at : new Date()

            await email_paramater.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "email_paramater is saved !",
                email_paramater,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating email_paramater.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * email_paramaterController. updateEmail_paramaterById()
     */
    updateEmail_paramaterById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var email_paramater = JSON.parse(req.body.email_paramater)
            } else {
                var { email_paramater
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            email_paramater = typeof (email_paramater) == "string" ? JSON.parse(email_paramater) : email_paramater

            if (!email_paramater) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of email_paramater.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(email_paramater).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty email_paramater !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/email_paramater", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/email_paramater/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                email_paramater.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/email_paramater/${file.filename}`

            }

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

            email_paramater.updated_at = email_paramater?.updated_at ? email_paramater.updated_at : new Date()

            delete email_paramater?._id
            await Email_paramaterModel.updateOne({ _id: id }, { ...email_paramater })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "email_paramater is updated !",
                email_paramater,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating email_paramater.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * email_paramaterController.sortEmail_paramaterByPosition
     */
    sortEmail_paramaterByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await Email_paramaterModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "email_paramater sorted !",
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
     * email_paramaterController.removeEmail_paramaterById()
     */
    removeEmail_paramaterById: async (req, res) => {
        try {
            var id = req.params.id;

            const email_paramater = await Email_paramaterModel.findOne({ _id: id }, { imageUrl: true })
            if (email_paramater) {
                // const old_image = email_paramater.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await Email_paramaterModel.deleteOne({ _id: id })


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
                message: 'Error when deleting email_paramater.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
