/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 01/06/2023 09:10:48
 */

const fs = require('fs')
const moment = require('moment')
const NewsletterModel = require('../models/newsletterModel.js');
const newsletterModel = require('../models/newsletterModel.js');


/**
 * newsletterController.js
 *
 * @description :: Server-side logic for managing newsletters.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * newsletterController.getNewsletters()
     */
    getNewslettersByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await NewsletterModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let newsletters = await NewsletterModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            newsletters = newsletters.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: newsletters.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: newsletters.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting newsletter.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * newsletterController.getNewsletters()
     */
    getNewsletters: async (req, res) => {
        try {
            const newsletters = await NewsletterModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: newsletters.length,
                results: newsletters,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting newsletter.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * newsletterController.showNewsletterById()
     */
    searchNewsletterByTag: async (req, res) => {
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

            let allCount = await NewsletterModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let newsletters = await NewsletterModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            newsletters = newsletters.map((item) => {
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
                results: newsletters.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting newsletter.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * newsletterController.showNewsletterById()
     */
    showNewsletterById: async (req, res) => {
        try {
            const id = req.params.id;
            const newsletter = await NewsletterModel.findOne({ _id: id })

            if (!newsletter) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such newsletter',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: newsletter,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting newsletter.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * newsletterController.showNewsletterById()
         */
        showNewsletterBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const newsletter = await NewsletterModel.findOne({ slug: slug })

                if (!newsletter) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such newsletter',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: newsletter,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting newsletter.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * newsletterController.createNewsletter()
     */
    createNewsletter: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var newsletter = JSON.parse(req.body.newsletter)
            } else {
                var { newsletter} = req.body
            }

            newsletter = typeof (newsletter) === "string" ? JSON.parse(newsletter) : newsletter
            console.log(req.body)

            if (!newsletter) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of newsletter.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if(await newsletterModel.findOne({email: newsletter.email})){
                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "newsletter is saved !",
                    newsletter,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(newsletter).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty newsletter !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/newsletter", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/newsletter/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                newsletter.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/newsletter/${file.filename}`

            }

            newsletter = new NewsletterModel({ ...newsletter })

            newsletter.created_at = newsletter?.created_at ? newsletter.created_at : new Date()

            await newsletter.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "newsletter is saved !",
                newsletter,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating newsletter.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * newsletterController. updateNewsletterById()
     */
    updateNewsletterById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var newsletter = JSON.parse(req.body.newsletter)
            } else {
                var { newsletter
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            newsletter = typeof (newsletter) == "string" ? JSON.parse(newsletter) : newsletter

            if (!newsletter) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of newsletter.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(newsletter).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty newsletter !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/newsletter", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/newsletter/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                newsletter.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/newsletter/${file.filename}`

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

            newsletter.updated_at = newsletter?.updated_at ? newsletter.updated_at : new Date()

            delete newsletter?._id
            await NewsletterModel.updateOne({ _id: id }, { ...newsletter })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "newsletter is updated !",
                newsletter,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating newsletter.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * newsletterController.sortNewsletterByPosition
     */
    sortNewsletterByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await NewsletterModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "newsletter sorted !",
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
     * newsletterController.removeNewsletterById()
     */
    removeNewsletterById: async (req, res) => {
        try {
            var id = req.params.id;

            const newsletter = await NewsletterModel.findOne({ _id: id }, { imageUrl: true })
            if (newsletter) {
                // const old_image = newsletter.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await NewsletterModel.deleteOne({ _id: id })


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
                message: 'Error when deleting newsletter.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
