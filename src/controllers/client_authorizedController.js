/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/09/2023 17:11:13
 */

const fs = require('fs')
const moment = require('moment')
const Client_authorizedModel = require('../models/client_authorizedModel.js');


/**
 * client_authorizedController.js
 *
 * @description :: Server-side logic for managing client_authorizeds.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * client_authorizedController.getClient_authorizeds()
     */
    getClient_authorizedsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await Client_authorizedModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let client_authorizeds = await Client_authorizedModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            client_authorizeds = client_authorizeds.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: client_authorizeds.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: client_authorizeds.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting client_authorized.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * client_authorizedController.getClient_authorizeds()
     */
    getClient_authorizeds: async (req, res) => {
        try {
            const client_authorizeds = await Client_authorizedModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: client_authorizeds.length,
                results: client_authorizeds,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting client_authorized.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * client_authorizedController.showClient_authorizedById()
     */
    searchClient_authorizedByTag: async (req, res) => {
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

            let allCount = await Client_authorizedModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let client_authorizeds = await Client_authorizedModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            client_authorizeds = client_authorizeds.map((item) => {
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
                results: client_authorizeds.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting client_authorized.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * client_authorizedController.showClient_authorizedById()
         */
        showClient_authorizedById: async (req, res) => {
            try {
                const id = req.params.id;
                const client_authorized = await Client_authorizedModel.findOne({ _id: id })

                if (!client_authorized) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such client_authorized',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: client_authorized,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting client_authorized.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * client_authorizedController.showClient_authorizedById()
         */
        showClient_authorizedBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const client_authorized = await Client_authorizedModel.findOne({ slug: slug })

                if (!client_authorized) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such client_authorized',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: client_authorized,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting client_authorized.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
        },

            /**
             * Generate By Mudey Formation (https://mudey.fr)
             * client_authorizedController.createClient_authorized()
             */
            createClient_authorized: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var client_authorized = JSON.parse(req.body.client_authorized)
                    } else {
                        var { client_authorized
                    } = req.body
                }

        client_authorized = typeof (client_authorized) === "string" ? JSON.parse(client_authorized) : client_authorized
                console.log(req.body)

                if (!client_authorized) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of client_authorized.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(client_authorized).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty client_authorized !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/client_authorized", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/client_authorized/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    client_authorized.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/client_authorized/${file.filename}`
                   
                }

                client_authorized = new Client_authorizedModel({ ...client_authorized })

                client_authorized.created_at = client_authorized?.created_at ? client_authorized.created_at : new Date()

                await client_authorized.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "client_authorized is saved !",
                client_authorized,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating client_authorized.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * client_authorizedController. updateClient_authorizedById()
     */
    updateClient_authorizedById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var client_authorized = JSON.parse(req.body.client_authorized)
        } else {
            var { client_authorized
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    client_authorized = typeof (client_authorized) == "string" ? JSON.parse(client_authorized) : client_authorized

    if (!client_authorized) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of client_authorized.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(client_authorized).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty client_authorized !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    if (req?.files?.length) {
        const file = req?.files[0]
        fs.mkdir(process.cwd() + "/public/assets/files/client_authorized", (err) => {
            if (err) console.log(err)
        })
        fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/client_authorized/${file.filename}`, function (err) {
            if (err) throw err
            console.log('Successfully renamed - moved!')
        })

        client_authorized.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/client_authorized/${file.filename}`
      
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

    client_authorized.updated_at = client_authorized?.updated_at ? client_authorized.updated_at : new Date()

    delete client_authorized?._id
    await Client_authorizedModel.updateOne({ _id: id }, { ...client_authorized })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "client_authorized is updated !",
                client_authorized,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating client_authorized.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * client_authorizedController.sortClient_authorizedByPosition
     */
    sortClient_authorizedByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await Client_authorizedModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "client_authorized sorted !",
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
     * client_authorizedController.removeClient_authorizedById()
     */
    removeClient_authorizedById: async (req, res) => {
        try {
            var id = req.params.id;

            const client_authorized = await Client_authorizedModel.findOne({ _id: id }, { imageUrl: true })
            if (client_authorized) {
                // const old_image = client_authorized.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await Client_authorizedModel.deleteOne({ _id: id })


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
                message: 'Error when deleting client_authorized.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
