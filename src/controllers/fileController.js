/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 21:28:14
 */
const moment = require('moment')
const FileModel = require('../models/fileModel.js');

/**
 * fileController.js
 *
 * @description :: Server-side logic for managing files.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * fileController.getFiles()
     */
    getFilesByPage: async (req, res) => {
        try {
            const pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            const pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await FileModel.find({}).count()

            let files = await FileModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            files = files.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: files.length,
                current: pageNumber,
                next: allCount > (pageNumber*pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: files.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
            

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting file.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * fileController.getFiles()
     */
    getFiles: async (req, res) => {
        try {
            const files = await FileModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: files.length,
                results: files,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting file.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * fileController.showFileById()
     */
    searchFileByTag: async (req, res) => {
        try {

            let filter = {}
            const pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            const pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            const email = req.query?.email ? new RegExp(req.query.email, 'i') : null
            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const content = req.query?.content ? new RegExp(req.query.content, 'i') : null
            const description = req.query?.description ? new RegExp(req.query.content, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if(email){
                filter.email = email
            }
            if(name){
                filter.name = name
            }
            if(content){
                filter.content = content
            }
            if(description){
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

            let allCount = await FileModel.find(filter).count()
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                // .sort('-created_at')
                // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let files = await FileModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            files = files.map((item) => {
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
                next: allCount > (pageNumber*pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: files.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting file.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * fileController.showFileById()
     */
    showFileById: async (req, res) => {
        try {
            const id = req.params.id;
            const file = await FileModel.findOne({ _id: id })

            if (!file) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such file',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: file,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting file.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * fileController.createFile()
     */
    createFile: async (req, res) => {
    try {

        let file = req.body

        if(!name){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of file.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        if(!Object.keys(name).length){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty file !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        file = new FileModel({ ...file })

        file.created_at = file?.created_at ? file.created_at : new Date()

        await file.save()

        return res.status(201).json({
            isSuccess: true,
            statusCode: 201,
            message: "file is saved !",
                file,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating file.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * fileController. updateFileById()
     */
    updateFileById: async (req, res) => {
    try {
        const id = req.params.id;
        let file = req.body

        if(!name){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of file.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
        if(!Object.keys(name).length){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty file !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        file.updated_at = file?.updated_at ? file.updated_at : new Date()

        delete file?._id
        await FileModel.updateOne({ _id: id }, { ...file })

        return res.status(200).json({
            isSuccess: true,
            statusCode: 200,
            message: "file is updated !",
                file,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when updating file.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * fileController.sortFileByPosition
     */
    sortFileByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await FileModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "file sorted !",
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
     * fileController.removeFileById()
     */
    removeFileById: async (req, res) => {
        try {
            var id = req.params.id;

            await FileModel.deleteOne({ _id: id })


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
                message: 'Error when deleting file.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
