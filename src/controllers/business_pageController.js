/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:48:20
 */

const fs = require('fs')
const moment = require('moment')
const Business_pageModel = require('../models/business_pageModel.js');


/**
 * business_pageController.js
 *
 * @description :: Server-side logic for managing business_pages.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * business_pageController.getBusiness_pages()
     */
    getBusiness_pagesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await Business_pageModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let business_pages = await Business_pageModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            business_pages = business_pages.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: business_pages.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: business_pages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting business_page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * business_pageController.getBusiness_pages()
     */
    getBusiness_pages: async (req, res) => {
        try {
            const business_pages = await Business_pageModel.find({})

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: business_pages.length,
                results: business_pages,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting business_page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * business_pageController.showBusiness_pageById()
     */
    searchBusiness_pageByTag: async (req, res) => {
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

            let allCount = await Business_pageModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let business_pages = await Business_pageModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            business_pages = business_pages.map((item) => {
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
                results: business_pages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting business_page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * business_pageController.showBusiness_pageById()
    */
    showBusiness_pageById: async (req, res) => {
        try {
                const id = req.params.id;
                const business_page = await Business_pageModel.findOne({ _id: id })

                if (!business_page) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such business_page',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: business_page,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting business_page.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        }
    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * business_pageController.showBusiness_pageById()
    */
    showBusiness_pageBySlug: async (req, res) => {
        try {
                const id = req.params.slug;
                const business_page = await Business_pageModel.findOne({ slug: slug })

                if (!business_page) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such business_page',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: business_page,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

        } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting business_page.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
    * Generate By Mudey Formation (https://mudey.fr)
    * business_pageController.createBusiness_page()
    */
    createBusiness_page: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var business_page = JSON.parse(req.body.business_page)
                    } else {
                        var { business_page
                    } = req.body
                }

        business_page = typeof (business_page) === "string" ? JSON.parse(business_page) : business_page
                console.log(req.body)

                if (!business_page) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of business_page.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(business_page).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Empty business_page !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }
                //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/business_page", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/business_page/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    business_page.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/business_page/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/business_page", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/business_page/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         business_page.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/business_page/${file.filename}`)
                //         
                //     });
                // }

                business_page = new Business_pageModel({ ...business_page })

                business_page.created_at = business_page?.created_at ? business_page.created_at : new Date()

                await business_page.save()

                return res.status(201).json({
                    isSuccess: true,
                    statusCode: 201,
                    message: "business_page is saved !",
                business_page,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when creating business_page.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * business_pageController. updateBusiness_pageById()
     */
    updateBusiness_pageById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var business_page = JSON.parse(req.body.business_page)
        } else {
            var { business_page
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    business_page = typeof (business_page) == "string" ? JSON.parse(business_page) : business_page

    if (!business_page) {
        return res.status(422).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Missing params of business_page.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(business_page).length) {
        return res.status(500).json({
            isSuccess: false,
            statusCode: 422,
            message: 'Empty business_page !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    //Upload single file
                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/business_page", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/business_page/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    business_page.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/business_page/${file.filename}`
                }


                // Upload many files
                // if (req?.files?.length) {
                //     req?.files.forEach(file => {
                //         fs.mkdir(process.cwd() + "/public/assets/files/business_page", (err) => {
                //             if (err) console.log(err)
                //         })
                //         fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/business_page/${file.filename}`, function (err) {
                //             if (err) throw err
                //             console.log('Successfully renamed - moved!')
                //         })
                //         
                //         business_page.imageUrls.push(`${req.protocol}://${req.get('host')}/assets/files/business_page/${file.filename}`)
                //         
                //     });
                // }

    if (deleteFiles?.length) {
        deleteFiles.forEach(currentFileUrl =>{
            const filename = "public/assets/" + currentFileUrl.split('/assets/')[1];
            console.log({ filename });
            fs.unlink(filename, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });

        })
    }

    business_page.updated_at = business_page?.updated_at ? business_page.updated_at : new Date()

    delete business_page?._id
    await Business_pageModel.updateOne({ _id: id }, { ...business_page })

    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "business_page is updated !",
                business_page,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        message: 'Error when updating business_page.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * business_pageController.sortBusiness_pageByPosition
     */
    sortBusiness_pageByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await Business_pageModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            statusCode: 200,
            isSuccess: true,
            message: "business_page sorted !",
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
     * business_pageController.removeBusiness_pageById()
     */
    removeBusiness_pageById: async (req, res) => {
        try {
            var id = req.params.id;

            const business_page = await Business_pageModel.findOne({ _id: id }, { imageUrl: true })
            if (business_page) {
                // const old_image = business_page.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await Business_pageModel.deleteOne({ _id: id })


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
                message: 'Error when deleting business_page.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
