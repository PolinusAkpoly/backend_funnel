/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 13:15:07
 */

const fs = require('fs')
const moment = require('moment')
const CommentModel = require('../models/commentModel.js');
const postModel = require('../models/postModel.js');


/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * commentController.getComments()
     */
    getCommentsByPage: async (req, res) => {
        try {
            let postId = req.query.postId
            if (!postId) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Error when getting comment : Post Id not found !',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await CommentModel.find({ postId }).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let comments = await CommentModel.find({ postId })
                .populate({
                    path: "ownership",
                    select: "fullName firstname lastname"  ,
                    options:{
                        populate: "profile"
                    }              
                })
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            comments = comments.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: comments.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: comments.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting comment.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * commentController.getComments()
     */
    getComments: async (req, res) => {
        try {
            const comments = await CommentModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: comments.length,
                results: comments,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting comment.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * commentController.showCommentById()
     */
    searchCommentByTag: async (req, res) => {
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

            let allCount = await CommentModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let comments = await CommentModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            comments = comments.map((item) => {
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
                results: comments.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting comment.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * commentController.showCommentById()
    */
    showCommentById: async (req, res) => {
        try {
            const id = req.params.id;
            const comment = await CommentModel.findOne({ _id: id })

            if (!comment) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such comment',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: comment,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting comment.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
        * Generate By Mudey Formation (https://mudey.fr)
        * commentController.showCommentById()
        */
        showCommentBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const comment = await CommentModel.findOne({ slug: slug })

                if (!comment) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such comment',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: comment,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting comment.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * commentController.createComment()
    */
    createComment: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var comment = JSON.parse(req.body.comment)
            } else {
                var { comment
                } = req.body
            }

            comment = typeof (comment) === "string" ? JSON.parse(comment) : comment
            console.log(req.body)

            if (!comment) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of comment.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(comment).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty comment !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            //Upload single file
            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/comment", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/comment/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                comment.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/comment/${file.filename}`
            }


            // Upload many files
            // if (req?.files?.length) {
            //     req?.files.forEach(file => {
            //         fs.mkdir(process.cwd() + "/public/assets/files/comment", (err) => {
            //             if (err) console.log(err)
            //         })
            //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/comment/${file.filename}`, function (err) {
            //             if (err) throw err
            //             console.log('Successfully renamed - moved!')
            //         })
            //         
            //         comment.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/comment/${file.filename}`)
            //         
            //     });
            // }

            comment = new CommentModel({ ...comment })

            comment.created_at = comment?.created_at ? comment.created_at : new Date()
            
            await postModel.updateOne({_id: comment.postId},{
                $inc: {comment_count: 1}
            })

            await comment.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "comment is saved !",
                comment,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating comment.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * commentController. updateCommentById()
     */
    updateCommentById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var comment = JSON.parse(req.body.comment)
            } else {
                var { comment
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            comment = typeof (comment) == "string" ? JSON.parse(comment) : comment

            if (!comment) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of comment.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(comment).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty comment !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            //Upload single file
            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/comment", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/comment/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                comment.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/comment/${file.filename}`
            }


            // Upload many files
            // if (req?.files?.length) {
            //     req?.files.forEach(file => {
            //         fs.mkdir(process.cwd() + "/public/assets/files/comment", (err) => {
            //             if (err) console.log(err)
            //         })
            //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/comment/${file.filename}`, function (err) {
            //             if (err) throw err
            //             console.log('Successfully renamed - moved!')
            //         })
            //         
            //         comment.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/comment/${file.filename}`)
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

            comment.updated_at = comment?.updated_at ? comment.updated_at : new Date()

            delete comment?._id
            await CommentModel.updateOne({ _id: id }, { ...comment })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "comment is updated !",
                comment,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating comment.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * commentController.sortCommentByPosition
     */
    sortCommentByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await CommentModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "comment sorted !",
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
     * commentController.removeCommentById()
     */
    removeCommentById: async (req, res) => {
        try {
            var id = req.params.id;

            const comment = await CommentModel.findOne({ _id: id }, { imageUrl: true })
            if (comment) {
                // const old_image = comment.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await CommentModel.deleteOne({ _id: id })


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
                message: 'Error when deleting comment.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
