/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:19:13
 */

const fs = require('fs')
const moment = require('moment')
const TunnelsteptypeModel = require('../models/TunnelStepTypeModel.js');


/**
 * TunnelStepTypeController.js
 *
 * @description :: Server-side logic for managing TunnelStepTypes.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepTypeController.getTunnelsteptypes()
     */
    getTunnelsteptypesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await TunnelsteptypeModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let TunnelStepTypes = await TunnelsteptypeModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            TunnelStepTypes = TunnelStepTypes.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: TunnelStepTypes.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: TunnelStepTypes.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStepType.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepTypeController.getTunnelsteptypes()
     */
    getTunnelsteptypes: async (req, res) => {
        try {
            const TunnelStepTypes = await TunnelsteptypeModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: TunnelStepTypes.length,
                results: TunnelStepTypes,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStepType.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepTypeController.showTunnelsteptypeById()
     */
    searchTunnelsteptypeByTag: async (req, res) => {
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

            let allCount = await TunnelsteptypeModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let TunnelStepTypes = await TunnelsteptypeModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            TunnelStepTypes = TunnelStepTypes.map((item) => {
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
                results: TunnelStepTypes.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStepType.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepTypeController.showTunnelsteptypeById()
     */
    showTunnelsteptypeById: async (req, res) => {
        try {
            const id = req.params.id;
            const TunnelStepType = await TunnelsteptypeModel.findOne({ _id: id })

            if (!TunnelStepType) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such TunnelStepType',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: TunnelStepType,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStepType.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * TunnelStepTypeController.showTunnelsteptypeById()
         */
        showTunnelsteptypeBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const TunnelStepType = await TunnelsteptypeModel.findOne({ slug: slug })

                if (!TunnelStepType) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such TunnelStepType',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: TunnelStepType,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting TunnelStepType.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepTypeController.createTunnelsteptype()
     */
    createTunnelsteptype: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var TunnelStepType = JSON.parse(req.body.TunnelStepType)
            } else {
                var { TunnelStepType
                } = req.body
            }

            TunnelStepType = typeof (TunnelStepType) === "string" ? JSON.parse(TunnelStepType) : TunnelStepType
            console.log(req.body)

            if (!TunnelStepType) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of TunnelStepType.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(TunnelStepType).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty TunnelStepType !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/TunnelStepType", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/TunnelStepType/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                TunnelStepType.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/TunnelStepType/${file.filename}`

            }

            TunnelStepType = new TunnelsteptypeModel({ ...TunnelStepType })

            TunnelStepType.created_at = TunnelStepType?.created_at ? TunnelStepType.created_at : new Date()

            await TunnelStepType.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "TunnelStepType is saved !",
                TunnelStepType,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating TunnelStepType.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepTypeController. updateTunnelsteptypeById()
     */
    updateTunnelsteptypeById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var TunnelStepType = JSON.parse(req.body.TunnelStepType)
            } else {
                var { TunnelStepType
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            TunnelStepType = typeof (TunnelStepType) == "string" ? JSON.parse(TunnelStepType) : TunnelStepType

            if (!TunnelStepType) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of TunnelStepType.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(TunnelStepType).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty TunnelStepType !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/TunnelStepType", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/TunnelStepType/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                TunnelStepType.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/TunnelStepType/${file.filename}`

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

            TunnelStepType.updated_at = TunnelStepType?.updated_at ? TunnelStepType.updated_at : new Date()

            delete TunnelStepType?._id
            await TunnelsteptypeModel.updateOne({ _id: id }, { ...TunnelStepType })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "TunnelStepType is updated !",
                TunnelStepType,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating TunnelStepType.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepTypeController.sortTunnelsteptypeByPosition
     */
    sortTunnelsteptypeByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await TunnelsteptypeModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "TunnelStepType sorted !",
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
     * TunnelStepTypeController.removeTunnelsteptypeById()
     */
    removeTunnelsteptypeById: async (req, res) => {
        try {
            var id = req.params.id;

            const TunnelStepType = await TunnelsteptypeModel.findOne({ _id: id }, { imageUrl: true })
            if (TunnelStepType) {
                // const old_image = TunnelStepType.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await TunnelsteptypeModel.deleteOne({ _id: id })


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
                message: 'Error when deleting TunnelStepType.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
