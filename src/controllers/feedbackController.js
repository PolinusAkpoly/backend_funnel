/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 13:17:47
 */

const fs = require('fs')
const moment = require('moment')
const FeedbackModel = require('../models/feedbackModel.js');


/**
 * feedbackController.js
 *
 * @description :: Server-side logic for managing feedbacks.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * feedbackController.getFeedbacks()
     */
    getFeedbacksByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await FeedbackModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let feedbacks = await FeedbackModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            feedbacks = feedbacks.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: feedbacks.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: feedbacks.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * feedbackController.getFeedbacks()
     */
    getFeedbacks: async (req, res) => {
        try {
            const feedbacks = await FeedbackModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: feedbacks.length,
                results: feedbacks,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * feedbackController.showFeedbackById()
     */
    searchFeedbackByTag: async (req, res) => {
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

            let allCount = await FeedbackModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let feedbacks = await FeedbackModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            feedbacks = feedbacks.map((item) => {
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
                results: feedbacks.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * feedbackController.showFeedbackById()
    */
    showFeedbackById: async (req, res) => {
        try {
                const id = req.params.id;
                const feedback = await FeedbackModel.findOne({ _id: id })

                if (!feedback) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such feedback',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: feedback,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting feedback.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        }
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * feedbackController.showFeedbackById()
    */
    showFeedbackBySlug: async (req, res) => {
        try {
                const id = req.params.slug;
                const feedback = await FeedbackModel.findOne({ slug: slug })

                if (!feedback) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such feedback',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: feedback,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting feedback.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * feedbackController.createFeedback()
    */
    createFeedback: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var feedback = JSON.parse(req.body.feedback)
                    } else {
                        var { feedback
                    } = req.body
                }

        feedback = typeof (feedback) === "string" ? JSON.parse(feedback) : feedback
                console.log(req.body)

                if (!feedback) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of feedback.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(feedback).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty feedback !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }
                //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/feedback", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/feedback/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    feedback.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/feedback/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/feedback", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/feedback/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         feedback.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/feedback/${file.filename}`)
                //         
                //     });
                // }

                feedback = new FeedbackModel({ ...feedback })

                feedback.created_at = feedback?.created_at ? feedback.created_at : new Date()

                await feedback.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "feedback is saved !",
                feedback,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating feedback.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * feedbackController. updateFeedbackById()
     */
    updateFeedbackById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var feedback = JSON.parse(req.body.feedback)
        } else {
            var { feedback
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    feedback = typeof (feedback) == "string" ? JSON.parse(feedback) : feedback

    if (!feedback) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of feedback.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(feedback).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty feedback !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/feedback", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/feedback/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    feedback.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/feedback/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/feedback", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/feedback/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         feedback.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/feedback/${file.filename}`)
                //         
                //     });
                // }

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

    feedback.updated_at = feedback?.updated_at ? feedback.updated_at : new Date()

    delete feedback?._id
    await FeedbackModel.updateOne({ _id: id }, { ...feedback })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "feedback is updated !",
                feedback,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating feedback.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * feedbackController.sortFeedbackByPosition
     */
    sortFeedbackByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await FeedbackModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "feedback sorted !",
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
     * feedbackController.removeFeedbackById()
     */
    removeFeedbackById: async (req, res) => {
        try {
            var id = req.params.id;

            const feedback = await FeedbackModel.findOne({ _id: id }, { imageUrl: true })
            if (feedback) {
                // const old_image = feedback.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await FeedbackModel.deleteOne({ _id: id })


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
                message: 'Error when deleting feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
