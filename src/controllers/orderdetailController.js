/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 06:35:42
 */
const moment = require('moment')
const OrderdetailModel = require('../models/orderdetailModel.js');

/**
 * orderdetailController.js
 *
 * @description :: Server-side logic for managing orderdetails.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * orderdetailController.getOrderdetails()
     */
    getOrderdetailsByPage: async (req, res) => {
        try {
            const pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            const pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let orderdetailCount = await OrderdetailModel.find({}).count()

            let orderdetails = await OrderdetailModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit + 1)

            orderdetails = orderdetails.map((item) => {
                item.created_formatted_with_time_since = moment(item?.createdAt).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                orderdetailCount: orderdetailCount,
                resultCount: orderdetails.length - 1,
                current: pageNumber,
                next: orderdetails[pageLimit + 1] ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: orderdetails.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting orderdetail.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * orderdetailController.getOrderdetails()
     */
    getOrderdetails: async (req, res) => {
        try {
            const orderdetails = await OrderdetailModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: orderdetails.length,
                results: orderdetails,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting orderdetail.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * orderdetailController.showOrderdetailById()
     */
    searchOrderdetailByTag: async (req, res) => {
        try {

            let filter = {}
            const pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            const pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            // const email = req.query?.email ? new RegExp(req.query.email, 'i') : null
            // const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            // const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            // if(email){
            //     filter.email = email
            // }
            // if (startDate) {
            //     filter.created_at = { $gt: startDate }
            // }

            // if (endDate) {
            //     if (filter.createdAt) {
            //         filter.created_at = { ...filter.createdAt, $lt: endDate }
            //     } else {
            //         filter.created_at = { $lt: endDate }
            //     }
            // }

            let orderdetails = await OrderdetailModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'createdAt': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit + 1)

            orderdetails = orderdetails.map((item) => {
                item.created_formatted_with_time_since = moment(item?.createdAt).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                filter: req.query,
                current: pageNumber,
                next: orderdetails[pageLimit + 1] ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: orderdetails.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting orderdetail.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * orderdetailController.showOrderdetailById()
     */
    showOrderdetailById: async (req, res) => {
        try {
            const id = req.params.id;
            const orderdetail = await OrderdetailModel.findOne({ _id: id })

            if (!orderdetail) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such orderdetail',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: orderdetail,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting orderdetail.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * orderdetailController.createOrderdetail()
     */
    createOrderdetail: async (req, res) => {
        try {

            let orderdetail = req.body

            if (!orderdetail) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of orderdetail.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(orderdetail).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty orderdetail !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            orderdetail = new OrderdetailModel({ ...orderdetail })

            orderdetail.created_at = orderdetail?.created_at ? orderdetail.created_at : new Date()

            await orderdetail.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "orderdetail is saved !",
                orderdetail,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating orderdetail.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * orderdetailController. updateOrderdetailById()
     */
    updateOrderdetailById: async (req, res) => {
        try {
            const id = req.params.id;
            let orderdetail = req.body

            if (!name) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of orderdetail.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(name).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty orderdetail !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            orderdetail.updated_at = orderdetail?.updated_at ? orderdetail.updated_at : new Date()

            delete orderdetail?._id
            await OrderdetailModel.updateOne({ _id: id }, { ...orderdetail })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "orderdetail is updated !",
                orderdetail,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating orderdetail.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * orderdetailController.sortOrderdetailByPosition
     */
    sortOrderdetailByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await OrderdetailModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "orderdetail sorted !",
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
     * orderdetailController.removeOrderdetailById()
     */
    removeOrderdetailById: async (req, res) => {
        try {
            var id = req.params.id;

            await OrderdetailModel.deleteOne({ _id: id })


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
                message: 'Error when deleting orderdetail.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
