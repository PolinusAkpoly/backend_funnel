/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:54:14
 */

const fs = require('fs')
const moment = require('moment')
const StoryModel = require('../models/storyModel.js');


/**
 * storyController.js
 *
 * @description :: Server-side logic for managing storys.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * storyController.getStorys()
     */
    getStorysByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await StoryModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let storys = await StoryModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            storys = storys.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: storys.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: storys.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting story.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * storyController.getStorys()
     */
    getStorys: async (req, res) => {
        try {
            const storys = await StoryModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: storys.length,
                results: storys,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting story.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * storyController.showStoryById()
     */
    searchStoryByTag: async (req, res) => {
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

            let allCount = await StoryModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let storys = await StoryModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            storys = storys.map((item) => {
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
                results: storys.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting story.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * storyController.showStoryById()
    */
    showStoryById: async (req, res) => {
        try {
                const id = req.params.id;
                const story = await StoryModel.findOne({ _id: id })

                if (!story) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such story',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: story,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting story.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        }
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * storyController.showStoryById()
    */
    showStoryBySlug: async (req, res) => {
        try {
                const id = req.params.slug;
                const story = await StoryModel.findOne({ slug: slug })

                if (!story) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such story',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: story,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting story.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * storyController.createStory()
    */
    createStory: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var story = JSON.parse(req.body.story)
                    } else {
                        var { story
                    } = req.body
                }

        story = typeof (story) === "string" ? JSON.parse(story) : story
                console.log(req.body)

                if (!story) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of story.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(story).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty story !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }
                //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/story", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/story/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    story.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/story/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/story", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/story/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         story.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/story/${file.filename}`)
                //         
                //     });
                // }

                story = new StoryModel({ ...story })

                story.created_at = story?.created_at ? story.created_at : new Date()

                await story.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "story is saved !",
                story,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating story.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * storyController. updateStoryById()
     */
    updateStoryById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var story = JSON.parse(req.body.story)
        } else {
            var { story
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    story = typeof (story) == "string" ? JSON.parse(story) : story

    if (!story) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of story.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(story).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty story !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/story", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/story/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    story.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/story/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/story", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/story/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         story.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/story/${file.filename}`)
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

    story.updated_at = story?.updated_at ? story.updated_at : new Date()

    delete story?._id
    await StoryModel.updateOne({ _id: id }, { ...story })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "story is updated !",
                story,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating story.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * storyController.sortStoryByPosition
     */
    sortStoryByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await StoryModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "story sorted !",
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
     * storyController.removeStoryById()
     */
    removeStoryById: async (req, res) => {
        try {
            var id = req.params.id;

            const story = await StoryModel.findOne({ _id: id }, { imageUrl: true })
            if (story) {
                // const old_image = story.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await StoryModel.deleteOne({ _id: id })


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
                message: 'Error when deleting story.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
