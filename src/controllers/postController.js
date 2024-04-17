/**
import { filter } from 'rxjs';
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 11:08:06
 */

const fs = require('fs')
const moment = require('moment')
const PostModel = require('../models/postModel.js');
const { getFriendsId } = require('../helpers/utils.js');


/**
 * postController.js
 *
 * @description :: Server-side logic for managing posts.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * postController.getPosts()
     */
    getPostsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 10

            const friendsId = await getFriendsId(req.userId)
            console.log({friendsId});
            let filter = {
                $or: [
                    {visibility: "PUBLIC"},
                    {visibility: "PRIVATE", ownership: req.userId},
                    {visibility: "FRIENDS", ownership: req.userId},
                    {visibility: "FRIENDS", ownership: friendsId},
                ]
            }
            let allCount = await PostModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let posts = await PostModel.find(filter)
                .populate({
                    path:"with_friends",
                    select: "_id fullName firstname lastname",
                    options: {
                        populate: "profile"
                    }
                })
                .populate({
                    path:"ownership",
                    select: "_id fullName firstname lastname",
                    options: {
                        populate: "profile"
                    }
                })
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            posts = posts.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: posts.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: posts.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * postController.getPosts()
     */
    getPosts: async (req, res) => {
        try {
            const posts = await PostModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: posts.length,
                results: posts,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * postController.showPostById()
     */
    searchPostByTag: async (req, res) => {
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

            let allCount = await PostModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let posts = await PostModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            posts = posts.map((item) => {
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
                results: posts.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting post.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * postController.showPostById()
    */
    showPostById: async (req, res) => {
        try {
                const id = req.params.id;
                const post = await PostModel.findOne({ _id: id })

                if (!post) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such post',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: post,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting post.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        }
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * postController.showPostById()
    */
    showPostBySlug: async (req, res) => {
        try {
                const id = req.params.slug;
                const post = await PostModel.findOne({ slug: slug })

                if (!post) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such post',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: post,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting post.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * postController.createPost()
    */
    createPost: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var post = JSON.parse(req.body.post)
                    } else {
                        var { post
                    } = req.body
                }

        post = typeof (post) === "string" ? JSON.parse(post) : post
                console.log(req.body)

                if (!post) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of post.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(post).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty post !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }
                //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/post", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    post.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/post/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/post", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         post.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/post/${file.filename}`)
                //         
                //     });
                // }

                post = new PostModel({ ...post })

                post.created_at = post?.created_at ? post.created_at : new Date()

                await post.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "post is saved !",
                post,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating post.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * postController. updatePostById()
     */
    updatePostById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var post = JSON.parse(req.body.post)
        } else {
            var { post
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    post = typeof (post) == "string" ? JSON.parse(post) : post

    if (!post) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of post.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(post).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty post !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/post", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    post.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/post/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/post", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/post/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         post.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/post/${file.filename}`)
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

    post.updated_at = post?.updated_at ? post.updated_at : new Date()

    delete post?._id
    await PostModel.updateOne({ _id: id }, { ...post })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "post is updated !",
                post,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating post.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * postController.sortPostByPosition
     */
    sortPostByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await PostModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "post sorted !",
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
     * postController.removePostById()
     */
    removePostById: async (req, res) => {
        try {
            var id = req.params.id;

            const post = await PostModel.findOne({ _id: id }, { imageUrl: true })
            if (post) {
                // const old_image = post.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await PostModel.deleteOne({ _id: id })


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
                message: 'Error when deleting post.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
