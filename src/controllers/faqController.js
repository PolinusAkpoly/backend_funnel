/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 15:40:57
 */
const moment = require('moment')
const FaqModel = require('../models/faqModel.js');

/**
 * faqController.js
 *
 * @description :: Server-side logic for managing faqs.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * faqController.getFaqs()
     */
    getFaqsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await FaqModel.find({}).count()

            if(pageNumber >  Math.ceil(allCount/pageLimit)){
                const value = Math.ceil(allCount/pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let faqs = await FaqModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            faqs = faqs.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: faqs.length,
                current: pageNumber,
                next: allCount > (pageNumber*pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: faqs.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
            

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting faq.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * faqController.getFaqs()
     */
    getFaqs: async (req, res) => {
        try {
            const faqs = await FaqModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: faqs.length,
                results: faqs,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting faq.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
},

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * faqController.showFaqById()
     */
    searchFaqByTag: async (req, res) => {
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

            let allCount = await FaqModel.find(filter).count()

            if(pageNumber >  Math.ceil(allCount/pageLimit)){
                const value = Math.ceil(allCount/pageLimit)
                pageNumber = value > 0 ? value : 1
            }
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                // .sort('-created_at')
                // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let faqs = await FaqModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            faqs = faqs.map((item) => {
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
                results: faqs.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting faq.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * faqController.showFaqById()
     */
    showFaqById: async (req, res) => {
        try {
            const id = req.params.id;
            const faq = await FaqModel.findOne({ _id: id })

            if (!faq) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such faq',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: faq,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when getting faq.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });

    }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * faqController.createFaq()
     */
    createFaq: async (req, res) => {
    try {

        
        if(req.file){
            var  faq  = JSON.parse(req.body.faq)
        }else{
            var { faq } = req.body
        }

        if(!faq){
            return res.status(422).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of faq.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        if(!Object.keys(faq).length){
            return res.status(422).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty faq !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }

        // if (req.file) {
        //     faq.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/${req.file.filename}`
        // }

        faq = new FaqModel({ ...faq })

        faq.created_at = faq?.created_at ? faq.created_at : new Date()

        await faq.save()

        return res.status(201).json({
            isSuccess: true,
            statusCode: 201,
            message: "faq is saved !",
                faq,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating faq.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * faqController. updateFaqById()
     */
    updateFaqById: async (req, res) => {
    try {
        const id = req.params.id;
        if(req.file){
            var  faq  = JSON.parse(req.body.faq)
        }else{
            var { faq } = req.body
        }

        if(!faq){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Missing params of faq.',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
        if(!Object.keys(faq).length){
            return res.status(500).json({
                isSuccess: false,
                statusCode: 422,
                message: 'Empty faq !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
        // if (req.file) {
        //     console.log({ imageUrl: faq.imageUrl });
        //     const old_image = faq.imageUrl
        //     faq.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/${req.file.filename}`

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

        faq.updated_at = faq?.updated_at ? faq.updated_at : new Date()

        delete faq?._id
        await FaqModel.updateOne({ _id: id }, { ...faq })

        return res.status(200).json({
            isSuccess: true,
            statusCode: 200,
            message: "faq is updated !",
                faq,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Error when updating faq.',
            error: error,
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * faqController.sortFaqByPosition
     */
    sortFaqByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await FaqModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "faq sorted !",
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
     * faqController.removeFaqById()
     */
    removeFaqById: async (req, res) => {
        try {
            var id = req.params.id;

            const faq = await FaqModel.findOne({ _id: id }, { imageUrl: true })
            if (faq) {
                // const old_image = faq.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await FaqModel.deleteOne({ _id: id })


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
                message: 'Error when deleting faq.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
