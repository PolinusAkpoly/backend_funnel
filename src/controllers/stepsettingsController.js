/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/02/2024 20:25:10
 */

const fs = require('fs')
const moment = require('moment')
const StepsettingsModel = require('../models/stepsettingsModel.js');
const { cleanLink } = require('../helpers/fileHelpers.js');


/**
 * stepsettingsController.js
 *
 * @description :: Server-side logic for managing stepsettingss.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * stepsettingsController.getStepsettingss()
     */
    getStepsettingssByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await StepsettingsModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let stepsettingss = await StepsettingsModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            stepsettingss = stepsettingss.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: stepsettingss.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: stepsettingss.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * stepsettingsController.getStepsettingss()
     */
    getStepsettingss: async (req, res) => {
        try {
            const stepsettingss = await StepsettingsModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: stepsettingss.length,
                results: stepsettingss,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    getStepsettingsByTunnel: async (req, res) => {
        try {
            const { tunnelId, stepId } = req.params


            const stepsettings = await StepsettingsModel.findOne({
                tunnelId,
                stepId,
                userId: req.userId
            })

            if(stepsettings && stepsettings.blocks){
                stepsettings.blocks = stepsettings.blocks.map((block)=>{
                    block.templates = block.templates.map((template)=>{
                        if(template?.src){
                            const link = cleanLink(template.src )
                            console.log({link});
                            template.src  = link
                        }
                        return template 
                    })
                    return block
                })
            }

            if (!stepsettings) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: "Setting not found !",
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: stepsettings,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * stepsettingsController.showStepsettingsById()
     */
    searchStepsettingsByTag: async (req, res) => {
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

            let allCount = await StepsettingsModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let stepsettingss = await StepsettingsModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            stepsettingss = stepsettingss.map((item) => {
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
                results: stepsettingss.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * stepsettingsController.showStepsettingsById()
     */
    showStepsettingsById: async (req, res) => {
        try {
            const id = req.params.id;
            const stepsettings = await StepsettingsModel.findOne({ _id: id })

            if (!stepsettings) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such stepsettings',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: stepsettings,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * stepsettingsController.showStepsettingsById()
         */
        showStepsettingsBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const stepsettings = await StepsettingsModel.findOne({ slug: slug })

                if (!stepsettings) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such stepsettings',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: stepsettings,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting stepsettings.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * stepsettingsController.createStepsettings()
     */
    createStepsettings: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var stepsettings = JSON.parse(req.body.stepsettings)
            } else {
                var { stepsettings } = req.body
            }

            stepsettings = typeof (stepsettings) === "string" ? JSON.parse(stepsettings) : stepsettings
            console.log(req.body)

            if (!stepsettings) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of stepsettings.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(stepsettings).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty stepsettings !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            const old = await StepsettingsModel.findOne({
                tunnelId: stepsettings.tunnelId,
                stepId: stepsettings.stepId,
                userId: req.userId,
            })

            if (old) {
                await StepsettingsModel.updateOne({
                    _id: old._id
                }, {
                    $set: {
                        ...stepsettings,
                        tunnelId: stepsettings.tunnelId,
                        stepId: stepsettings.stepId,
                        userId: req.userId,
                        updated_at: new Date()
                    }
                })
                return res.status(201).json({
                    isSuccess: true,
                    status: 201,
                    message: "stepsettings is updated !",
                    old,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            stepsettings = new StepsettingsModel({ ...stepsettings,userId: req.userId })

            stepsettings.created_at = stepsettings?.created_at ? stepsettings.created_at : new Date()

            await stepsettings.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "stepsettings is saved !",
                stepsettings,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    getStepTemplate: async (req, res) => {
        try {
            const { tunnelId, stepId } = req.params;
    
            let step = await StepsettingsModel.findOne({
                tunnelId: tunnelId,
                stepId: stepId,
                userId: req.userId,
            });
    

            if (!step) {
                step = new StepsettingsModel({
                    tunnelId: tunnelId,
                    stepId: stepId,
                    userId: req.userId,
                });
                await step.save()
            }

            if(step && step.blocks){
                step.blocks = step.blocks.map((block)=>{
                    block.templates = block.templates.map((template)=>{
                        if(template?.src){
                            const link = cleanLink(template.src )
                            console.log({link});
                            template.src  = link
                        }
                        return template 
                    })
                    return block
                })
            }

    
            return res.status(200).json({
                isSuccess: true,
                status: 200,
                blocks: step.blocks,
                message: 'Step template added successfully.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
    
        } catch (error) {
            console.log(error);
    
            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating step settings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },   
    addStepTemplate: async (req, res) => {
        try {
            const { tunnelId, stepId } = req.params;
            const { blocks } = req.body;
    
            const step = await StepsettingsModel.findOne({
                tunnelId: tunnelId,
                stepId: stepId,
                userId: req.userId,
            });
    
            if (!step) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'Error: Step not found.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            console.log({blocks});

            await StepsettingsModel.updateOne({
                tunnelId: tunnelId,
                stepId: stepId,
                userId: req.userId,
            },{$set:{blocks}})
    
            // step.template = template; // Corrected typo: changed 'tamplate' to 'template'
            // await step.save(); // Await saving operation
    
            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: 'Step template added successfully.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
    
        } catch (error) {
            console.log(error);
    
            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating step settings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },   

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * stepsettingsController. updateStepsettingsById()
     */
    updateStepsettingsById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var stepsettings = JSON.parse(req.body.stepsettings)
            } else {
                var { stepsettings
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            stepsettings = typeof (stepsettings) == "string" ? JSON.parse(stepsettings) : stepsettings

            if (!stepsettings) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of stepsettings.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(stepsettings).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty stepsettings !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/stepsettings", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/stepsettings/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                stepsettings.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/stepsettings/${file.filename}`

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

            stepsettings.updated_at = stepsettings?.updated_at ? stepsettings.updated_at : new Date()

            delete stepsettings?._id
            await StepsettingsModel.updateOne({ _id: id }, { ...stepsettings })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "stepsettings is updated !",
                stepsettings,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * stepsettingsController.sortStepsettingsByPosition
     */
    sortStepsettingsByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await StepsettingsModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "stepsettings sorted !",
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
     * stepsettingsController.removeStepsettingsById()
     */
    removeStepsettingsById: async (req, res) => {
        try {
            var id = req.params.id;

            const stepsettings = await StepsettingsModel.findOne({ _id: id }, { imageUrl: true })
            if (stepsettings) {
                // const old_image = stepsettings.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await StepsettingsModel.deleteOne({ _id: id })


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
                message: 'Error when deleting stepsettings.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
