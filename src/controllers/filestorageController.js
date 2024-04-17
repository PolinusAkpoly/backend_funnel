/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 15/02/2024 18:15:05
 */

const fs = require('fs')
const moment = require('moment')
const FilestorageModel = require('../models/filestorageModel.js');
const { UploadFile, deleteUploadedFile, cleanLink } = require('../helpers/fileHelpers.js');


/**
 * filestorageController.js
 *
 * @description :: Server-side logic for managing filestorages.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * filestorageController.getFilestorages()
     */
    getFilestoragesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await FilestorageModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let filestorages = await FilestorageModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            filestorages = filestorages.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: filestorages.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: filestorages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * filestorageController.getFilestorages()
     */
    getFilestorages: async (req, res) => {
        try {
            const filestorages = await FilestorageModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: filestorages.length,
                results: filestorages,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * filestorageController.showFilestorageById()
     */
    searchFilestorageByTag: async (req, res) => {
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

            let allCount = await FilestorageModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let filestorages = await FilestorageModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            filestorages = filestorages.map((item) => {
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
                results: filestorages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    searchFilestorageByTagAndUserId: async (req, res) => {
        try {
            let filter = { userId: req.userId };
            let pageNumber = parseInt(req.query?.pageNumber) || 1;
            let pageLimit = parseInt(req.query?.pageLimit) || 5;
    
            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null;
            const type = req.query?.type ? new RegExp(req.query.type, 'i') : null;
            const startDate = req.query?.startDate ? new Date(req.query.startDate) : null;
            const endDate = req.query?.endDate ? new Date(req.query.endDate) : null;
    
            if (name) {
                filter.name = name;
            }
            if (type) {
                filter.type = type;
            }
    
            if (startDate) {
                filter.created_at = { $gt: startDate };
            }
    
            if (endDate) {
                filter.created_at = filter.created_at || {};
                filter.created_at.$lt = endDate;
            }
    
            let allCount = await FilestorageModel.countDocuments(filter);
    
            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                pageNumber = Math.max(1, Math.ceil(allCount / pageLimit));
            }
    
            let filestorages = await FilestorageModel.find(filter)
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit)
                .limit(pageLimit);
    
            filestorages = filestorages.map((item) => {
                item.link = cleanLink(item.link )
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow();
                return item;
            });
    
            return res.status(200).json({
                isSuccess: true,
                status: 200,
                filter: req.query,
                resultCount: filestorages.length,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: filestorages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
    
        } catch (error) {
            console.error(error);
    
            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * filestorageController.showFilestorageById()
     */
    showFilestorageById: async (req, res) => {
        try {
            const id = req.params.id;
            const filestorage = await FilestorageModel.findOne({ _id: id })

            if (!filestorage) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such filestorage',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: filestorage,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * filestorageController.showFilestorageById()
         */
        showFilestorageBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const filestorage = await FilestorageModel.findOne({ slug: slug })

                if (!filestorage) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such filestorage',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: filestorage,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting filestorage.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * filestorageController.createFilestorage()
     */
    createFilestorage: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var filestorage = JSON.parse(req.body.filestorage)
            } else {
                var { filestorage } = req.body
            }

            filestorage = typeof (filestorage) === "string" ? JSON.parse(filestorage) : filestorage
            console.log(req.body)

            if (!filestorage) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of filestorage.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(filestorage).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty filestorage !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }


            filestorage = UploadFile(req, filestorage, "filestorage", FilestorageModel, ['link'])

            filestorage = new FilestorageModel({ ...filestorage ,userId: req.userId })


            filestorage.created_at = filestorage?.created_at ? filestorage.created_at : new Date()

            filestorage.link = cleanLink(filestorage.link )
            await filestorage.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "filestorage is saved !",
                filestorage,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * filestorageController. updateFilestorageById()
     */
    updateFilestorageById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var filestorage = JSON.parse(req.body.filestorage)
            } else {
                var { filestorage
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            filestorage = typeof (filestorage) == "string" ? JSON.parse(filestorage) : filestorage

            if (!filestorage) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of filestorage.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(filestorage).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty filestorage !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            filestorage = UploadFile(req, filestorage, "filestorage", FilestorageModel, ['link'])

            filestorage.updated_at = new Date()
            filestorage.link = cleanLink(filestorage.link )
            delete filestorage?._id

            await FilestorageModel.updateOne({ _id: id }, { 
                $set:{...filestorage}
             })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "filestorage is updated !",
                filestorage,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * filestorageController.sortFilestorageByPosition
     */
    sortFilestorageByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await FilestorageModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "filestorage sorted !",
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
     * filestorageController.removeFilestorageById()
     */
    removeFilestorageById: async (req, res) => {
        try {
            var id = req.params.id;

            const filestorage = await FilestorageModel.findOne({ _id: id }, { imageUrl: true })
            if (filestorage) {
                // const old_image = filestorage.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await FilestorageModel.deleteOne({ _id: id })
                const dirPath = process.cwd() + `/public/assets/files/filestorage`
                deleteUploadedFile(dirPath, FilestorageModel, ['link'])


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
                message: 'Error when deleting filestorage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
