/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 04/06/2023 11:06:19
 */

const fs = require('fs')
const moment = require('moment')
const ReviewModel = require('../models/reviewModel.js');


/**
 * reviewController.js
 *
 * @description :: Server-side logic for managing reviews.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * reviewController.getReviews()
     */
    getReviewsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await ReviewModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let reviews = await ReviewModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            reviews = reviews.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: reviews.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: reviews.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting review.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * reviewController.getReviews()
     */
    getReviews: async (req, res) => {
        try {
            const reviews = await ReviewModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: reviews.length,
                results: reviews,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting review.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * reviewController.showReviewById()
     */
    searchReviewByTag: async (req, res) => {
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

            let allCount = await ReviewModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let reviews = await ReviewModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            reviews = reviews.map((item) => {
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
                results: reviews.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting review.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * reviewController.showReviewById()
         */
        showReviewById: async (req, res) => {
            try {
                const id = req.params.id;
                const review = await ReviewModel.findOne({ _id: id })

                if (!review) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such review',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: review,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting review.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * reviewController.showReviewById()
         */
        showReviewBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const review = await ReviewModel.findOne({ slug: slug })

                if (!review) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such review',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: review,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting review.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
        },

            /**
             * Generate By Mudey Formation (https://mudey.fr)
             * reviewController.createReview()
             */
            createReview: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var review = JSON.parse(req.body.review)
                    } else {
                        var { review
                    } = req.body
                }

        review = typeof (review) === "string" ? JSON.parse(review) : review
                console.log(req.body)

                if (!review) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of review.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(review).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty review !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/review", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/review/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    review.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/review/${file.filename}`
                   
                }

                review = new ReviewModel({ ...review })

                review.created_at = review?.created_at ? review.created_at : new Date()

                await review.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "review is saved !",
                review,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating review.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * reviewController. updateReviewById()
     */
    updateReviewById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var review = JSON.parse(req.body.review)
        } else {
            var { review
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    review = typeof (review) == "string" ? JSON.parse(review) : review

    if (!review) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of review.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(review).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty review !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    if (req?.files?.length) {
        const file = req?.files[0]
        fs.mkdir(process.cwd() + "/public/assets/files/review", (err) => {
            if (err) console.log(err)
        })
        fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/review/${file.filename}`, function (err) {
            if (err) throw err
            console.log('Successfully renamed - moved!')
        })

        review.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/review/${file.filename}`
      
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

    review.updated_at = review?.updated_at ? review.updated_at : new Date()

    delete review?._id
    await ReviewModel.updateOne({ _id: id }, { ...review })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "review is updated !",
                review,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating review.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * reviewController.sortReviewByPosition
     */
    sortReviewByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await ReviewModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "review sorted !",
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
     * reviewController.removeReviewById()
     */
    removeReviewById: async (req, res) => {
        try {
            var id = req.params.id;

            const review = await ReviewModel.findOne({ _id: id }, { imageUrl: true })
            if (review) {
                // const old_image = review.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await ReviewModel.deleteOne({ _id: id })


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
                message: 'Error when deleting review.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
