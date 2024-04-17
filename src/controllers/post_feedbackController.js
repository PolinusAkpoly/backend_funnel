/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 02/08/2023 17:04:13
 */

const fs = require('fs')
const moment = require('moment')
const Post_feedbackModel = require('../models/post_feedbackModel.js');


/**
 * post_feedbackController.js
 *
 * @description :: Server-side logic for managing post_feedbacks.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * post_feedbackController.getPost_feedbacks()
     */
    getPost_feedbacksByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await Post_feedbackModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let post_feedbacks = await Post_feedbackModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            post_feedbacks = post_feedbacks.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: post_feedbacks.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: post_feedbacks.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    getPost_feedbacksByPost: async (req, res) => {
        try {
            let postId = req.params.postId

            if (!postId) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Error when getting post_feedback. Post Id not found !',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }


            let allCount = await Post_feedbackModel.find({ postId }).count()



            let post_feedbacks = await Post_feedbackModel.find({ postId })
                // .populate("name")
                .sort("-created_at")


            post_feedbacks = post_feedbacks.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            const types = ["LIKE", "HEART", "SOLIDARITY", "HAHA", "WAHOU", "SAD", "ANGRY"]

            const results = types.map((type) => {
                const values = post_feedbacks.filter((p) => p.type === type)
                return {
                    name: type,
                    count: values.length,
                    values: values
                }
            })

            console.log(post_feedbacks);

            const current = post_feedbacks.filter((p) => p.author.toString() === req.userId)[0]



            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                current,
                results: results,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * post_feedbackController.getPost_feedbacks()
     */
    getPost_feedbacks: async (req, res) => {
        try {
            const post_feedbacks = await Post_feedbackModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: post_feedbacks.length,
                results: post_feedbacks,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * post_feedbackController.showPost_feedbackById()
     */
    searchPost_feedbackByTag: async (req, res) => {
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

            let allCount = await Post_feedbackModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let post_feedbacks = await Post_feedbackModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            post_feedbacks = post_feedbacks.map((item) => {
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
                results: post_feedbacks.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * post_feedbackController.showPost_feedbackById()
    */
    showPost_feedbackById: async (req, res) => {
        try {
            const id = req.params.id;
            const post_feedback = await Post_feedbackModel.findOne({ _id: id })

            if (!post_feedback) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such post_feedback',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: post_feedback,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
        * Generate By Mudey Formation (https://mudey.fr)
        * post_feedbackController.showPost_feedbackById()
        */
        showPost_feedbackBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const post_feedback = await Post_feedbackModel.findOne({ slug: slug })

                if (!post_feedback) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such post_feedback',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: post_feedback,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting post_feedback.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * post_feedbackController.createPost_feedback()
    */
    createPost_feedback: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var post_feedback = JSON.parse(req.body.post_feedback)
            } else {
                var { post_feedback
                } = req.body
            }

            post_feedback = typeof (post_feedback) === "string" ? JSON.parse(post_feedback) : post_feedback
            console.log(req.body)

            if (!post_feedback) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of post_feedback.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(post_feedback).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty post_feedback !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            //Upload single file
            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/post_feedback", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post_feedback/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                post_feedback.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/post_feedback/${file.filename}`
            }


            // Upload many files
            // if (req?.files?.length) {
            //     req?.files.forEach(file => {
            //         fs.mkdir(process.cwd() + "/public/assets/files/post_feedback", (err) => {
            //             if (err) console.log(err)
            //         })
            //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post_feedback/${file.filename}`, function (err) {
            //             if (err) throw err
            //             console.log('Successfully renamed - moved!')
            //         })
            //         
            //         post_feedback.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/post_feedback/${file.filename}`)
            //         
            //     });
            // }

            post_feedback = new Post_feedbackModel({ ...post_feedback })

            post_feedback.created_at = post_feedback?.created_at ? post_feedback.created_at : new Date()

            await post_feedback.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "post_feedback is saved !",
                post_feedback,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    addPost_feedback: async (req, res) => {
        try {

            var { post_feedback} = req.body


            if (!post_feedback) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of post_feedback.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(post_feedback).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty post_feedback !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
          

            const isExist = await Post_feedbackModel.findOne({
                postId: post_feedback.postId,
                author: post_feedback.author,
            })
            
            if(!isExist){
                post_feedback = new Post_feedbackModel({ ...post_feedback })
    
                post_feedback.created_at = post_feedback?.created_at ? post_feedback.created_at : new Date()
    
                await post_feedback.save()
            }else{
                if(isExist.type === post_feedback.type){
                    await Post_feedbackModel.deleteOne({
                        postId: post_feedback.postId,
                        author: post_feedback.author,
                    })
                }else{
                    isExist.type = post_feedback.type
                    await isExist.save()

                }
            }

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "post_feedback is saved !",
                post_feedback,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * post_feedbackController. updatePost_feedbackById()
     */
    updatePost_feedbackById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var post_feedback = JSON.parse(req.body.post_feedback)
            } else {
                var { post_feedback
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            post_feedback = typeof (post_feedback) == "string" ? JSON.parse(post_feedback) : post_feedback

            if (!post_feedback) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of post_feedback.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(post_feedback).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty post_feedback !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            //Upload single file
            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/post_feedback", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post_feedback/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                post_feedback.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/post_feedback/${file.filename}`
            }


            // Upload many files
            // if (req?.files?.length) {
            //     req?.files.forEach(file => {
            //         fs.mkdir(process.cwd() + "/public/assets/files/post_feedback", (err) => {
            //             if (err) console.log(err)
            //         })
            //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post_feedback/${file.filename}`, function (err) {
            //             if (err) throw err
            //             console.log('Successfully renamed - moved!')
            //         })
            //         
            //         post_feedback.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/post_feedback/${file.filename}`)
            //         
            //     });
            // }

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

            post_feedback.updated_at = post_feedback?.updated_at ? post_feedback.updated_at : new Date()

            delete post_feedback?._id
            await Post_feedbackModel.updateOne({ _id: id }, { ...post_feedback })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "post_feedback is updated !",
                post_feedback,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * post_feedbackController.sortPost_feedbackByPosition
     */
    sortPost_feedbackByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await Post_feedbackModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "post_feedback sorted !",
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
     * post_feedbackController.removePost_feedbackById()
     */
    removePost_feedbackById: async (req, res) => {
        try {
            var id = req.params.id;

            const post_feedback = await Post_feedbackModel.findOne({ _id: id }, { imageUrl: true })
            if (post_feedback) {
                // const old_image = post_feedback.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await Post_feedbackModel.deleteOne({ _id: id })


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
                message: 'Error when deleting post_feedback.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
