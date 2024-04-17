/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:44:17
 */

const fs = require('fs')
const moment = require('moment')
const GroupModel = require('../models/groupModel.js');


/**
 * groupController.js
 *
 * @description :: Server-side logic for managing groups.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * groupController.getGroups()
     */
    getGroupsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await GroupModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let groups = await GroupModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            groups = groups.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: groups.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: groups.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting group.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * groupController.getGroups()
     */
    getGroups: async (req, res) => {
        try {
            const groups = await GroupModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: groups.length,
                results: groups,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting group.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * groupController.showGroupById()
     */
    searchGroupByTag: async (req, res) => {
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

            let allCount = await GroupModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let groups = await GroupModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            groups = groups.map((item) => {
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
                results: groups.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting group.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * groupController.showGroupById()
    */
    showGroupById: async (req, res) => {
        try {
                const id = req.params.id;
                const group = await GroupModel.findOne({ _id: id })

                if (!group) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such group',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: group,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting group.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        }
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * groupController.showGroupById()
    */
    showGroupBySlug: async (req, res) => {
        try {
                const id = req.params.slug;
                const group = await GroupModel.findOne({ slug: slug })

                if (!group) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such group',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: group,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting group.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * groupController.createGroup()
    */
    createGroup: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var group = JSON.parse(req.body.group)
                    } else {
                        var { group
                    } = req.body
                }

        group = typeof (group) === "string" ? JSON.parse(group) : group
                console.log(req.body)

                if (!group) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of group.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(group).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty group !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }
                //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/group", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/group/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    group.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/group/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/group", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/group/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         group.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/group/${file.filename}`)
                //         
                //     });
                // }

                group = new GroupModel({ ...group })

                group.created_at = group?.created_at ? group.created_at : new Date()

                await group.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "group is saved !",
                group,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating group.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * groupController. updateGroupById()
     */
    updateGroupById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var group = JSON.parse(req.body.group)
        } else {
            var { group
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    group = typeof (group) == "string" ? JSON.parse(group) : group

    if (!group) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of group.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(group).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty group !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/group", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/group/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    group.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/group/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/group", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/group/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         group.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/group/${file.filename}`)
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

    group.updated_at = group?.updated_at ? group.updated_at : new Date()

    delete group?._id
    await GroupModel.updateOne({ _id: id }, { ...group })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "group is updated !",
                group,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating group.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * groupController.sortGroupByPosition
     */
    sortGroupByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await GroupModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "group sorted !",
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
     * groupController.removeGroupById()
     */
    removeGroupById: async (req, res) => {
        try {
            var id = req.params.id;

            const group = await GroupModel.findOne({ _id: id }, { imageUrl: true })
            if (group) {
                // const old_image = group.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await GroupModel.deleteOne({ _id: id })


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
                message: 'Error when deleting group.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
