/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:18:32
 */

const fs = require('fs')
const moment = require('moment')
const TunnelstepModel = require('../models/TunnelStepModel.js');
const TunnelModel = require('../models/TunnelModel.js');


/**
 * TunnelStepController.js
 *
 * @description :: Server-side logic for managing TunnelSteps.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepController.getTunnelsteps()
     */
    getTunnelstepsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await TunnelstepModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let TunnelSteps = await TunnelstepModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            TunnelSteps = TunnelSteps.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: TunnelSteps.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: TunnelSteps.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStep.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepController.getTunnelsteps()
     */
    getTunnelsteps: async (req, res) => {
        try {
            const TunnelSteps = await TunnelstepModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: TunnelSteps.length,
                results: TunnelSteps,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStep.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepController.showTunnelstepById()
     */
    searchTunnelstepByTag: async (req, res) => {
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

            let allCount = await TunnelstepModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let TunnelSteps = await TunnelstepModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            TunnelSteps = TunnelSteps.map((item) => {
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
                results: TunnelSteps.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStep.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepController.showTunnelstepById()
     */
    showTunnelstepById: async (req, res) => {
        try {
            const id = req.params.id;
            const TunnelStep = await TunnelstepModel.findOne({ _id: id })

            if (!TunnelStep) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such TunnelStep',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: TunnelStep,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting TunnelStep.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * TunnelStepController.showTunnelstepById()
         */
        showTunnelstepBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const TunnelStep = await TunnelstepModel.findOne({ slug: slug })

                if (!TunnelStep) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such TunnelStep',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: TunnelStep,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting TunnelStep.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepController.createTunnelstep()
     */
    createTunnelstep: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var TunnelStep = JSON.parse(req.body.TunnelStep)
            } else {
                var { TunnelStep } = req.body
            }

            TunnelStep = typeof (TunnelStep) === "string" ? JSON.parse(TunnelStep) : TunnelStep
            console.log({TunnelStep})

            if (!TunnelStep) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of TunnelStep.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(TunnelStep).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty TunnelStep !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/TunnelStep", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/TunnelStep/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                TunnelStep.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/TunnelStep/${file.filename}`

            }

            const tunnelStepCount = await TunnelstepModel.countDocuments();

            TunnelStep = new TunnelstepModel({
                ...TunnelStep,
                position: tunnelStepCount,
                userId: req.userId,
            });


            TunnelStep.created_at = TunnelStep?.created_at ? TunnelStep.created_at : new Date()

            await TunnelStep.save()
            // Assuming that TunnelModel has a 'steps' property representing an array of step IDs
            await TunnelModel.updateOne({ _id: TunnelStep.tunnelId, userId: req.userId },
                {
                    $push: {
                        steps: TunnelStep._id
                    }
                });

            let data = await TunnelstepModel.findOne({ _id: TunnelStep._id, userId: req.userId })
                                .populate('type')


            console.log({data});

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "TunnelStep is saved !",
                result : data,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating TunnelStep.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepController. updateTunnelstepById()
     */
    updateTunnelstepById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var TunnelStep = JSON.parse(req.body.TunnelStep)
            } else {
                var { TunnelStep
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            TunnelStep = typeof (TunnelStep) == "string" ? JSON.parse(TunnelStep) : TunnelStep

            if (!TunnelStep) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of TunnelStep.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(TunnelStep).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty TunnelStep !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/TunnelStep", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/TunnelStep/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                TunnelStep.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/TunnelStep/${file.filename}`

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

            TunnelStep.updated_at = TunnelStep?.updated_at ? TunnelStep.updated_at : new Date()

            delete TunnelStep?._id
            await TunnelstepModel.updateOne({ _id: id }, { ...TunnelStep })

            let data = await TunnelstepModel.findOne({ tunnelId: TunnelStep.tunnelId, userId: req.userId })

            return res.status(201).json({
                isSuccess: true,
                status: 200,
                message: "TunnelStep is updated !",
                result : data,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating TunnelStep.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelStepController.sortTunnelstepByPosition
     */
    sortTunnelstepByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await TunnelstepModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "TunnelStep sorted !",
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
     * TunnelStepController.removeTunnelstepById()
     */
    removeTunnelstepById: async (req, res) => {
        try {
            var id = req.params.id;

            const TunnelStep = await TunnelstepModel.findOne({ _id: id }, { imageUrl: true })
            if (TunnelStep) {
                // const old_image = TunnelStep.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await TunnelstepModel.deleteOne({ _id: id })


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
                message: 'Error when deleting TunnelStep.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
