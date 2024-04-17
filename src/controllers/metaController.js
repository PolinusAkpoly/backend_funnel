/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 14:37:22
 */
const moment = require('moment')
const MetaModel = require('../models/metaModel.js');

/**
 * metaController.js
 *
 * @description :: Server-side logic for managing metas.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * metaController.getMetas()
     */
    getMetasByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await MetaModel.find({}).count()

            if(pageNumber >  Math.ceil(allCount/pageLimit)){
                const value = Math.ceil(allCount/pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let metas = await MetaModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            metas = metas.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: metas.length,
                current: pageNumber,
                next: allCount > (pageNumber*pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: metas.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
            

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting meta.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * metaController.getMetas()
     */
    getMetas: async (req, res) => {
        try {
            const metas = await MetaModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: metas.length,
                results: metas,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting meta.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * metaController.showMetaById()
     */
    searchMetaByTag: async (req, res) => {
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

            let allCount = await MetaModel.find(filter).count()

            if(pageNumber >  Math.ceil(allCount/pageLimit)){
                const value = Math.ceil(allCount/pageLimit)
                pageNumber = value > 0 ? value : 1
            }
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                // .sort('-created_at')
                // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let metas = await MetaModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            metas = metas.map((item) => {
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
                results: metas.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting meta.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * metaController.showMetaById()
     */
    showMetaById: async (req, res) => {
        try {
            const id = req.params.id;
            const meta = await MetaModel.findOne({ _id: id })

            if (!meta) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such meta',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: meta,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting meta.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * metaController.createMeta()
     */
    createMeta: async (req, res) => {
    try {

        
        if(req.file){
            var  meta  = JSON.parse(req.body.meta)
        }else{
            var { meta } = req.body
        }

        if(!meta){
            return res.status(422).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of meta.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        if(!Object.keys(meta).length){
            return res.status(422).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty meta !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        // if (req.file) {
        //     meta.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/${req.file.filename}`
        // }

        meta = new MetaModel({ ...meta })

        meta.created_at = meta?.created_at ? meta.created_at : new Date()

        await meta.save()

        return res.status(201).json({
            isSuccess: true,
            statusCode: 201,
            message: "meta is saved !",
                meta,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating meta.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * metaController. updateMetaById()
     */
    updateMetaById: async (req, res) => {
    try {
        const id = req.params.id;
        if(req.file){
            var  meta  = JSON.parse(req.body.meta)
        }else{
            var { meta } = req.body
        }

        if(!meta){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of meta.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
        if(!Object.keys(meta).length){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty meta !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
        // if (req.file) {
        //     console.log({ imageUrl: meta.imageUrl });
        //     const old_image = meta.imageUrl
        //     meta.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/${req.file.filename}`

        //     if (old_image) {
        //         const filename = "public/assets/" + old_image.split('/assets/')[1];
        //         console.log({ filename });
        //         fs.unlink(filename, (err) => {
        //             if (err) {
        //                 console.log(err.message);
        //             }
        //         });
        //     }
        // }

        meta.updated_at = meta?.updated_at ? meta.updated_at : new Date()

        delete meta?._id
        await MetaModel.updateOne({ _id: id }, { ...meta })

        return res.status(200).json({
            isSuccess: true,
            statusCode: 200,
            message: "meta is updated !",
                meta,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when updating meta.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * metaController.sortMetaByPosition
     */
    sortMetaByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await MetaModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "meta sorted !",
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
     * metaController.removeMetaById()
     */
    removeMetaById: async (req, res) => {
        try {
            var id = req.params.id;

            const meta = await MetaModel.findOne({ _id: id }, { imageUrl: true })
            if (meta) {
                // const old_image = meta.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await MetaModel.deleteOne({ _id: id })


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
                message: 'Error when deleting meta.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
