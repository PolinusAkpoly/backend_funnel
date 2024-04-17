/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 19:20:01
 */
const moment = require('moment')
const PageModel = require('../models/pageModel.js');
const pageModel = require('../models/pageModel.js');
const { slugify } = require('../helpers/utils.js');

/**
 * pageController.js
 *
 * @description :: Server-side logic for managing pages.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController.getPages()
     */
    getPagesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await PageModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                pageNumber = Math.ceil(allCount / pageLimit)
            }

            let pages = await PageModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            pages = pages.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: pages.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: pages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController.getPages()
     */
    getPages: async (req, res) => {
        try {
            const pages = await PageModel.find({})

            

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: pages.length,
                results: pages,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController.showPageById()
     */
    searchPageByTag: async (req, res) => {
        try {

            let filter = {}
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5
            let option = req.query["option.position"]


            const email = req.query?.email ? new RegExp(req.query.email, 'i') : null
            const position = req.query?.position ? req.query?.position : null
            const column = req.query?.column ? req.query?.column : null
            const isTop = req.query?.isTop ? req.query?.isTop : null
            const isBottom = req.query?.isBottom ? req.query?.isBottom : null
            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const content = req.query?.content ? new RegExp(req.query.content, 'i') : null
            const description = req.query?.description ? new RegExp(req.query.content, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if (email) {
                filter.email = email
            }
            if (column) {
                filter.column = column
            }
             if (position) {
                filter.position = position
            }
             if (option) {
                filter["options.position"] = option
            }
            if (isTop) {
                filter.isTop = isTop
            }
            if (isBottom) {
                filter.isBottom = isBottom
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

            let allCount = await PageModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                pageNumber = Math.ceil(allCount / pageLimit)
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let pages = await PageModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            pages = pages.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            console.log(filter);

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                filter: req.query,
                resultCount: allCount,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: pages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController.showPageById()
     */
    showPageById: async (req, res) => {
        try {
            const id = req.params.id;
            const page = await PageModel.findOne({ _id: id })

            if (!page) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such page',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: page,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController.showPageBySlug()
     */
    showPageBySlug: async (req, res) => {
        try {
            const slug = req.params.slug;
            const page = await PageModel.findOne({ slug: slug })

            if (!page) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such page',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: page,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController.createPage()
     */
    createPage: async (req, res) => {
        try {

            let { page } = req.body
            
            let name = page.name
            let slug = slugify(name)

            index = 0
            words = ["shop", "jstore", "category", "mudey", "espero", "akpoli"]

            while (await pageModel.findOne({ slug }) && words[index]) {
                name += " " + words[index]
                slug = slugify(name)
                index++
            }

            page.slug = slug


            if (!page) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of page.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys('name').length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty page !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            page = new PageModel({ ...page })

            page.created_at = page?.created_at ? page.created_at : new Date()
            

            await page.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "page is saved !",
                page,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController. updatePageById()
     */
    updatePageById: async (req, res) => {
        try {
            const id = req.params.id;
            let { page } = req.body

            if (!page) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of page.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(page).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty page !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            page.updated_at = page?.updated_at ? page.updated_at : new Date()

            delete page?._id
            await PageModel.updateOne({ _id: id }, { ...page })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "page is updated !",
                page,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * pageController.sortPageByPosition
     */
    sortPageByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await PageModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "page sorted !",
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
     * pageController.removePageById()
     */
    removePageById: async (req, res) => {
        try {
            var id = req.params.id;

            await PageModel.deleteOne({ _id: id })


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
                message: 'Error when deleting page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
