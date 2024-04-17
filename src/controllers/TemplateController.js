/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 31/01/2024 09:57:30
 */

const fs = require('fs')
const moment = require('moment')
const TemplateModel = require('../models/TemplateModel.js');
const { deleteUploadedFile, UploadFile } = require('../helpers/fileHelpers.js');


/**
 * TemplateController.js
 *
 * @description :: Server-side logic for managing Templates.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TemplateController.getTemplates()
     */
    getTemplatesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await TemplateModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let Templates = await TemplateModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Templates = Templates.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: Templates.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: Templates.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TemplateController.getTemplates()
     */
    getTemplates: async (req, res) => {
        try {
            const Templates = await TemplateModel.find({},{templateUrl: false})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: Templates.length,
                results: Templates,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TemplateController.showTemplateById()
     */
    searchTemplateByTag: async (req, res) => {
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

            let allCount = await TemplateModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let Templates = await TemplateModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Templates = Templates.map((item) => {
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
                results: Templates.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TemplateController.showTemplateById()
     */
    showTemplateById: async (req, res) => {
        try {
            const id = req.params.id;
            const Template = await TemplateModel.findOne({ _id: id })

            if (!Template) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such Template',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: Template,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * TemplateController.showTemplateById()
         */
        showTemplateBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const Template = await TemplateModel.findOne({ slug: slug })

                if (!Template) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such Template',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: Template,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting Template.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },
    getTemplateLink: async (req, res) => {
        try {
            const id = req.params.id;
            const Template = await TemplateModel.findOne({ _id: id })

            if (!Template) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such Template',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if(!Template?.uniquePrefix){
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such Template',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }


            let link = Template.uniquePrefix
            let datas = fs.readdirSync(process.cwd()+'/public/templates/'+link)
            if(datas.length){
                link += '/'+datas[0]+"/index.html"
            }

            console.log({datas});

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: link,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * TemplateController.showTemplateById()
         */
        showTemplateBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const Template = await TemplateModel.findOne({ slug: slug })

                if (!Template) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such Template',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: Template,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting Template.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TemplateController.createTemplate()
     */
    createTemplate: async (req, res) => {
        try {

            if (req?.files?.lenth) {
                var Template = JSON.parse(req.body.Template)
            } else {
                var { Template } = req.body
            }

            Template = typeof (Template) === "string" ? JSON.parse(Template) : Template


            if (!Template) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of Template.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            

            if (!Object.keys(Template).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty Template !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

          

            Template = UploadFile(req, Template, "Template", TemplateModel, ['imageUrl', 'templateUrl'])

          
            Template = new TemplateModel({ ...Template })

            Template.created_at = Template?.created_at ? Template.created_at : new Date()

            await Template.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "Template is saved !",
                Template,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TemplateController. updateTemplateById()
     */
    updateTemplateById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var Template = JSON.parse(req.body.Template)
            } else {
                var { Template } = req.body
            }


            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)
            } catch (error) {
                var deleteFiles = []
            }


            Template = typeof (Template) == "string" ? JSON.parse(Template) : Template

            if (!Template) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of Template.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(Template).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty Template !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            Template = UploadFile(req, Template, "Template", TemplateModel, ['imageUrl', 'templateUrl'])

            console.log({Template});

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

            Template.updated_at = Template?.updated_at ? Template.updated_at : new Date()

            delete Template?._id
            await TemplateModel.updateOne({ _id: id }, { ...Template })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "Template is updated !",
                Template,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TemplateController.sortTemplateByPosition
     */
    sortTemplateByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await TemplateModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "Template sorted !",
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
     * TemplateController.removeTemplateById()
     */
    removeTemplateById: async (req, res) => {
        try {
            var id = req.params.id;

            const Template = await TemplateModel.findOne({ _id: id }, { imageUrl: true })
            if (Template) {
                // const old_image = Template.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await TemplateModel.deleteOne({ _id: id })
                // Template = UploadFile(req, Template, "Template", TemplateModel, ['imageUrl', 'templateUrl'])
                const dirPath = process.cwd() + `/public/assets/files/Template`
                deleteUploadedFile(dirPath, TemplateModel, ['imageUrl', 'templateUrl'])


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
                message: 'Error when deleting Template.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
