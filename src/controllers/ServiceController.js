/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/01/2024 12:09:18
 */

const fs = require('fs')
const moment = require('moment')
const ServiceModel = require('../models/ServiceModel.js');
const { UploadFile, deleteUploadedFile } = require('../helpers/fileHelpers.js');


/**
 * ServiceController.js
 *
 * @description :: Server-side logic for managing Services.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * ServiceController.getServices()
     */
    getServicesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await ServiceModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let Services = await ServiceModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Services = Services.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: Services.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: Services.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Service.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * ServiceController.getServices()
     */
    getServices: async (req, res) => {
        try {
            const Services = await ServiceModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: Services.length,
                results: Services,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Service.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * ServiceController.showServiceById()
     */
    searchServiceByTag: async (req, res) => {
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

            let allCount = await ServiceModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let Services = await ServiceModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Services = Services.map((item) => {
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
                results: Services.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Service.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * ServiceController.showServiceById()
     */
    showServiceById: async (req, res) => {
        try {
            const id = req.params.id;
            const Service = await ServiceModel.findOne({ _id: id })

            if (!Service) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such Service',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: Service,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Service.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * ServiceController.showServiceById()
         */
        showServiceBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const Service = await ServiceModel.findOne({ slug: slug })

                if (!Service) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such Service',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: Service,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting Service.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * ServiceController.createService()
     */
    createService: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var Service = JSON.parse(req.body.Service)
            } else {
                var { Service
                } = req.body
            }

            Service = typeof (Service) === "string" ? JSON.parse(Service) : Service
            console.log(req.body)

            if (!Service) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of Service.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(Service).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty Service !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            Service = UploadFile(req, Service, "Service", ServiceModel, ['imageUrl'])

           

            Service = new ServiceModel({ ...Service })

            Service.created_at = Service?.created_at ? Service.created_at : new Date()

            await Service.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "Service is saved !",
                Service,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating Service.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * ServiceController. updateServiceById()
     */
    updateServiceById: async (req, res) => {
        try {
            console.log({body: req.body})
            const id = req.params.id;
            if (req?.files?.length) {
                var Service = JSON.parse(req.body.Service)
            } else {
                var { Service } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            Service = typeof (Service) == "string" ? JSON.parse(Service) : Service

            if (!Service) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of Service.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(Service).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty Service !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            Service = UploadFile(req, Service, "Service", ServiceModel, ['imageUrl'])

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

            Service.updated_at = Service?.updated_at ? Service.updated_at : new Date()

            delete Service?._id
            await ServiceModel.updateOne({ _id: id }, { ...Service })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "Service is updated !",
                Service,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating Service.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * ServiceController.sortServiceByPosition
     */
    sortServiceByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await ServiceModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "Service sorted !",
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
     * ServiceController.removeServiceById()
     */
    removeServiceById: async (req, res) => {
        try {
            var id = req.params.id;

            const Service = await ServiceModel.findOne({ _id: id }, { imageUrl: true })
            if (Service) {
                // const old_image = Service.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await ServiceModel.deleteOne({ _id: id })
                const dirPath = process.cwd() + `/public/assets/files/Service`
                deleteUploadedFile(dirPath, ServiceModel, ['imageUrl'])


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
                message: 'Error when deleting Service.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
