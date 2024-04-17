/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 01/06/2023 15:37:06
 */

const fs = require('fs')
const moment = require('moment')
const Shop_paramsModel = require('../models/shop_paramsModel.js');
const { UploadFile } = require('../helpers/fileHelpers.js');


/**
 * shop_paramsController.js
 *
 * @description :: Server-side logic for managing shop_paramss.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * shop_paramsController.getShop_paramss()
     */
    getShop_paramssByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await Shop_paramsModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let shop_paramss = await Shop_paramsModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            shop_paramss = shop_paramss.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: shop_paramss.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: shop_paramss.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting shop_params.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * shop_paramsController.getShop_paramss()
     */
    getShop_paramss: async (req, res) => {
        try {
            const shop_paramss = await Shop_paramsModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: shop_paramss.length,
                results: shop_paramss,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting shop_params.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * shop_paramsController.showShop_paramsById()
     */
    searchShop_paramsByTag: async (req, res) => {
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

            let allCount = await Shop_paramsModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let shop_paramss = await Shop_paramsModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            shop_paramss = shop_paramss.map((item) => {
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
                results: shop_paramss.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting shop_params.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * shop_paramsController.showShop_paramsById()
     */
    showShop_paramsById: async (req, res) => {
        try {
            const id = req.params.id;
            const shop_params = await Shop_paramsModel.findOne({ _id: id })

            if (!shop_params) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such shop_params',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: shop_params,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting shop_params.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * shop_paramsController.showShop_paramsById()
         */
        showShop_paramsBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const shop_params = await Shop_paramsModel.findOne({ slug: slug })

                if (!shop_params) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such shop_params',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: shop_params,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting shop_params.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * shop_paramsController.createShop_params()
     */
    createShop_params: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var shop_params = JSON.parse(req.body.shop_params)
            } else {
                var { shop_params
                } = req.body
            }

            shop_params = typeof (shop_params) === "string" ? JSON.parse(shop_params) : shop_params
            console.log(req.body)

            if (!shop_params) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of shop_params.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(shop_params).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty shop_params !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            shop_params = UploadFile(req, shop_params, "shop_params", Shop_paramsModel, ['logo'])

            shop_params = new Shop_paramsModel({ ...shop_params })

            shop_params.created_at = shop_params?.created_at ? shop_params.created_at : new Date()

            await shop_params.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "shop_params is saved !",
                shop_params,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating shop_params.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * shop_paramsController. updateShop_paramsById()
     */
    updateShop_paramsById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var shop_params = JSON.parse(req.body.shop_params)
            } else {
                var { shop_params
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            shop_params = typeof (shop_params) == "string" ? JSON.parse(shop_params) : shop_params

            if(!shop_params?.logo?.length){
                delete shop_params?.logo
            }

            if (!shop_params) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of shop_params.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(shop_params).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty shop_params !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            shop_params = UploadFile(req, shop_params, "shop_params", Shop_paramsModel, ['logo'])
            

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

            shop_params.updated_at = shop_params?.updated_at ? shop_params.updated_at : new Date()

            delete shop_params?._id
            await Shop_paramsModel.updateOne({ _id: id }, { ...shop_params })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "shop_params is updated !",
                shop_params,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating shop_params.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * shop_paramsController.sortShop_paramsByPosition
     */
    sortShop_paramsByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await Shop_paramsModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "shop_params sorted !",
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
     * shop_paramsController.removeShop_paramsById()
     */
    removeShop_paramsById: async (req, res) => {
        try {
            var id = req.params.id;

            const shop_params = await Shop_paramsModel.findOne({ _id: id }, { logo: true })
            if (shop_params) {
                // const old_image = shop_params.logo
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await Shop_paramsModel.deleteOne({ _id: id })
                const dirPath = process.cwd() + `/public/assets/files/shop_params`
                deleteUploadedFile(dirPath, Shop_paramsModel, ['logo'])


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
                message: 'Error when deleting shop_params.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
