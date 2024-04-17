/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/10/2023 09:25:53
 */

const fs = require('fs')
const moment = require('moment')
const AuthstrategyModel = require('../models/authStrategyModel.js');
const { generateRandomCode } = require('../helpers/utils.js');


/**
 * authstrategyController.js
 *
 * @description :: Server-side logic for managing authstrategys.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * authstrategyController.getAuthstrategys()
     */
    getAuthstrategysByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await AuthstrategyModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let authstrategys = await AuthstrategyModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            authstrategys = authstrategys.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: authstrategys.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: authstrategys.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting authstrategy.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * authstrategyController.getAuthstrategys()
     */
    getAuthstrategys: async (req, res) => {
        try {
            const authstrategys = await AuthstrategyModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: authstrategys.length,
                results: authstrategys,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting authstrategy.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * authstrategyController.showAuthstrategyById()
     */
    searchAuthstrategyByTag: async (req, res) => {
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

            let allCount = await AuthstrategyModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let authstrategys = await AuthstrategyModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            authstrategys = authstrategys.map((item) => {
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
                results: authstrategys.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting authstrategy.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * authstrategyController.showAuthstrategyById()
     */
    showAuthstrategyById: async (req, res) => {
        try {
            const id = req.params.id;
            const authstrategy = await AuthstrategyModel.findOne({ _id: id })

            if (!authstrategy) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such authstrategy',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: authstrategy,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting authstrategy.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * authstrategyController.showAuthstrategyById()
         */
        showAuthstrategyBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const authstrategy = await AuthstrategyModel.findOne({ slug: slug })

                if (!authstrategy) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such authstrategy',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: authstrategy,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting authstrategy.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * authstrategyController.createAuthstrategy()
     */
    createAuthstrategy: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var authstrategy = JSON.parse(req.body.authstrategy)
            } else {
                var { authstrategy
                } = req.body
            }

            authstrategy = typeof (authstrategy) === "string" ? JSON.parse(authstrategy) : authstrategy
            console.log(req.body)

            if (!authstrategy) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of authstrategy.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(authstrategy).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty authstrategy !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/authstrategy", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/authstrategy/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                authstrategy.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/authstrategy/${file.filename}`

            }

            authstrategy = new AuthstrategyModel({ ...authstrategy })

            authstrategy.code = generateRandomCode(10)

            authstrategy.created_at = authstrategy?.created_at ? authstrategy.created_at : new Date()

            await authstrategy.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "authstrategy is saved !",
                authstrategy,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating authstrategy.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * authstrategyController. updateAuthstrategyById()
     */
    updateAuthstrategyById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var authstrategy = JSON.parse(req.body.authstrategy)
            } else {
                var { authstrategy
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            authstrategy = typeof (authstrategy) == "string" ? JSON.parse(authstrategy) : authstrategy

            if (!authstrategy) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of authstrategy.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(authstrategy).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty authstrategy !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/authstrategy", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/authstrategy/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                authstrategy.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/authstrategy/${file.filename}`

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

            authstrategy.updated_at = authstrategy?.updated_at ? authstrategy.updated_at : new Date()

            delete authstrategy?._id
            await AuthstrategyModel.updateOne({ _id: id }, { ...authstrategy })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "authstrategy is updated !",
                authstrategy,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating authstrategy.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * authstrategyController.sortAuthstrategyByPosition
     */
    sortAuthstrategyByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await AuthstrategyModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "authstrategy sorted !",
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
     * authstrategyController.removeAuthstrategyById()
     */
    removeAuthstrategyById: async (req, res) => {
        try {
            var id = req.params.id;

            const authstrategy = await AuthstrategyModel.findOne({ _id: id }, { imageUrl: true })
            if (authstrategy) {
                // const old_image = authstrategy.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await AuthstrategyModel.deleteOne({ _id: id })


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
                message: 'Error when deleting authstrategy.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
