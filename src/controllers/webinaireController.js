/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 15/10/2023 12:14:17
 */

const fs = require('fs')
const moment = require('moment')
const WebinaireModel = require('../models/webinaireModel.js');


/**
 * webinaireController.js
 *
 * @description :: Server-side logic for managing webinaires.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController.getWebinaires()
     */
    getWebinairesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await WebinaireModel.find({ author: req.userId }).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let webinaires = await WebinaireModel.find({ author: req.userId })
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            webinaires = webinaires.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: webinaires.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: webinaires.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController.getWebinaires()
     */
    getWebinaires: async (req, res) => {
        try {
            const webinaires = await WebinaireModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: webinaires.length,
                results: webinaires,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController.showWebinaireById()
     */
    searchWebinaireByTag: async (req, res) => {
        try {

            let filter = { author: req.userId }
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

            let allCount = await WebinaireModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let webinaires = await WebinaireModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            webinaires = webinaires.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                filter: req.query,
                resultCount: allCount,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: webinaires.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController.showWebinaireById()
     */
    showWebinaireById: async (req, res) => {
        try {
            const id = req.params.id;
            const webinaire = await WebinaireModel.findOne({ _id: id, author: req.userId })

            if (!webinaire) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such webinaire',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: webinaire,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * webinaireController.showWebinaireById()
         */
    },
    showWebinaireBySlug: async (req, res) => {
        try {
            const id = req.params.slug;
            const webinaire = await WebinaireModel.findOne({ slug: slug, author: req.userId })

            if (!webinaire) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such webinaire',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: webinaire,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController.createWebinaire()
     */
    createWebinaire: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var webinaire = JSON.parse(req.body.webinaire)
            } else {
                var { webinaire
                } = req.body
            }

            webinaire = typeof (webinaire) === "string" ? JSON.parse(webinaire) : webinaire
            console.log(req.body)

            if (!webinaire) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of webinaire.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(webinaire).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty webinaire !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/webinaire", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/webinaire/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                webinaire.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/webinaire/${file.filename}`

            }

            webinaire.author = req.userId
            webinaire = new WebinaireModel({ ...webinaire })

            webinaire.created_at = webinaire?.created_at ? webinaire.created_at : new Date()

            await webinaire.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "webinaire is saved !",
                webinaire,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController. updateWebinaireById()
     */
    updateWebinaireById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var webinaire = JSON.parse(req.body.webinaire)
            } else {
                var { webinaire
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            webinaire = typeof (webinaire) == "string" ? JSON.parse(webinaire) : webinaire

            if (!webinaire) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of webinaire.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(webinaire).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty webinaire !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/webinaire", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/webinaire/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                webinaire.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/webinaire/${file.filename}`

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

            webinaire.updated_at = webinaire?.updated_at ? webinaire.updated_at : new Date()

            delete webinaire?._id
            await WebinaireModel.updateOne({ _id: id }, { ...webinaire })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "webinaire is updated !",
                webinaire,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController.sortWebinaireByPosition
     */
    sortWebinaireByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await WebinaireModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "webinaire sorted !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * webinaireController.removeWebinaireById()
     */
    removeWebinaireById: async (req, res) => {
        try {
            var id = req.params.id;

            const webinaire = await WebinaireModel.findOne({ _id: id }, { imageUrl: true })
            if (webinaire) {
                // const old_image = webinaire.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await WebinaireModel.deleteOne({ _id: id })


                return res.status(204).json({
                    // 204 No Content
                    // isSuccess: true,
                    // status: 204,
                    // message: 'Data deleted ! .',
                });

            }

            return res.status(204).json({
                // 204 No Content
                // isSuccess: true,
                // status: 204,
                // message: 'Data deleted ! .',
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when deleting webinaire.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
