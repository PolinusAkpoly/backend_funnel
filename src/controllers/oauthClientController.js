/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 10:56:14
 */

const fs = require('fs')
const moment = require('moment')
const OAuthClientModel = require('../models/OAuthClientModel.js');
const { generateApiKey } = require('../helpers/utils.js');


/**
 * OAuthClientController.js
 *
 * @description :: Server-side logic for managing OAuthClients.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OAuthClientController.getOAuthClients()
     */
    getOAuthClientsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await OAuthClientModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let OAuthClients = await OAuthClientModel.find({author: req.userId})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            OAuthClients = OAuthClients.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: OAuthClients.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: OAuthClients.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OAuthClientController.getOAuthClients()
     */
    getOAuthClients: async (req, res) => {
        try {
            let OAuthClients = await OAuthClientModel.find({
                author: req.userId
            })
            // if (!OAuthClient) {
            //     const public_key = "public_ouitube_" + generateApiKey(160)
            //     const private_key = "private_ouitube_" + generateApiKey(160)

            //     OAuthClient = OAuthClientModel({
            //         public_key: public_key,
            //         private_key: private_key,
            //         created_at: new Date(),
            //         author: req.userId
            //     })

            //     await OAuthClient.save()
            // }

            return res.json({
                isSuccess: true,
                statusCode: 200,
                results: OAuthClients,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    regenerateOAuthClients: async (req, res) => {
        try {
            const { OAuthClientId } = req.params

            let OAuthClient = await OAuthClientModel.findOne({
                _id: OAuthClientId,
                author: req.userId,
            })

            if(!OAuthClient){
                return res.json({
                    isSuccess: false,
                    statusCode: 404,
                    message: "OAuthClient not found !",
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            OAuthClient.clientId = "ci_" + generateApiKey(160)
            OAuthClient.clientSecret = "cs_" + generateApiKey(160)

            await OAuthClient.save()


            return res.json({
                isSuccess: true,
                statusCode: 200,
                result: OAuthClient,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OAuthClientController.showOAuthClientById()
     */
    searchOAuthClientByTag: async (req, res) => {
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

            let allCount = await OAuthClientModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let OAuthClients = await OAuthClientModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            OAuthClients = OAuthClients.map((item) => {
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
                results: OAuthClients.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OAuthClientController.showOAuthClientById()
     */
    showOAuthClientById: async (req, res) => {
        try {
            const id = req.params.id;
            const OAuthClient = await OAuthClientModel.findOne({ _id: id })

            if (!OAuthClient) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such OAuthClient',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: OAuthClient,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * OAuthClientController.showOAuthClientById()
         */
        showOAuthClientBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const OAuthClient = await OAuthClientModel.findOne({ slug: slug })

                if (!OAuthClient) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such OAuthClient',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: OAuthClient,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting OAuthClient.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OAuthClientController.createOAuthClient()
     */
    createOAuthClient: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var oauthclient = JSON.parse(req.body.oauthclient)
            } else {
                var { oauthclient } = req.body
            }

            oauthclient = typeof (oauthclient) === "string" ? JSON.parse(OAuthClient) : oauthclient
            console.log(req.body)

            if (!oauthclient) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of oauthclient.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(oauthclient).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty oauthclient !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/oauthclient", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/OAuthClient/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                oauthclient.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/OAuthClient/${file.filename}`

            }

            const OAuthClient = new OAuthClientModel({ ...oauthclient })

            OAuthClient.clientId = "ci_" + generateApiKey(160)
            OAuthClient.clientSecret = "cs_" + generateApiKey(160)

            OAuthClient.author = req.userId
            OAuthClient.created_at = OAuthClient?.created_at ? OAuthClient.created_at : new Date()

            await OAuthClient.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "OAuthClient is saved !",
                OAuthClient,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OAuthClientController. updateOAuthClientById()
     */
    updateOAuthClientById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var oauthclient = JSON.parse(req.body.oauthclient)
            } else {
                var { oauthclient } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            oauthclient = typeof (oauthclient) == "string" ? JSON.parse(oauthclient) : oauthclient

            if (!oauthclient) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of OAuthClient.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(oauthclient).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty oauthclient !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/oauthclient", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/oauthclient/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                oauthclient.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/OAuthClient/${file.filename}`

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

            oauthclient.updated_at = oauthclient?.updated_at ? oauthclient.updated_at : new Date()

            delete oauthclient?._id
            await OAuthClientModel.updateOne({ _id: id }, { ...oauthclient })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "OAuthClient is updated !",
                oauthclient,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OAuthClientController.sortOAuthClientByPosition
     */
    sortOAuthClientByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await OAuthClientModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "OAuthClient sorted !",
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
     * OAuthClientController.removeOAuthClientById()
     */
    removeOAuthClientById: async (req, res) => {
        try {
            var id = req.params.id;

            const OAuthClient = await OAuthClientModel.findOne({ _id: id }, { imageUrl: true })
            if (OAuthClient) {
                // const old_image = OAuthClient.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await OAuthClientModel.deleteOne({ _id: id })


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
                message: 'Error when deleting OAuthClient.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};