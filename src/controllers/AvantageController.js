/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 01/03/2024 11:01:43
 */

const fs = require('fs')
const moment = require('moment')
const AvantageModel = require('../models/AvantageModel.js');


/**
 * AvantageController.js
 *
 * @description :: Server-side logic for managing Avantages.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * AvantageController.getAvantages()
     */
    getAvantagesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await AvantageModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let Avantages = await AvantageModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Avantages = Avantages.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: Avantages.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: Avantages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Avantage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * AvantageController.getAvantages()
     */
    getAvantages: async (req, res) => {
        try {
            const Avantages = await AvantageModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: Avantages.length,
                results: Avantages,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Avantage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * AvantageController.showAvantageById()
     */
    searchAvantageByTag: async (req, res) => {
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

            let allCount = await AvantageModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let Avantages = await AvantageModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Avantages = Avantages.map((item) => {
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
                results: Avantages.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Avantage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * AvantageController.showAvantageById()
         */
        showAvantageById: async (req, res) => {
            try {
                const id = req.params.id;
                const Avantage = await AvantageModel.findOne({ _id: id })

                if (!Avantage) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such Avantage',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: Avantage,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting Avantage.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * AvantageController.showAvantageById()
         */
        showAvantageBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const Avantage = await AvantageModel.findOne({ slug: slug })

                if (!Avantage) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such Avantage',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: Avantage,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting Avantage.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
        },

            /**
             * Generate By Mudey Formation (https://mudey.fr)
             * AvantageController.createAvantage()
             */
            createAvantage: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var Avantage = JSON.parse(req.body.Avantage)
                    } else {
                        var { Avantage
                    } = req.body
                }

        Avantage = typeof (Avantage) === "string" ? JSON.parse(Avantage) : Avantage
                console.log(req.body)

                if (!Avantage) {
                    return res.status(422).json({
                        isSuccess: false,
                        status: 422,
                        message: 'Missing params of Avantage.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(Avantage).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        status: 422,
                        message: 'Empty Avantage !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/Avantage", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/Avantage/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    Avantage.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/Avantage/${file.filename}`
                   
                }

                Avantage = new AvantageModel({ ...Avantage })

                Avantage.created_at = Avantage?.created_at ? Avantage.created_at : new Date()

                await Avantage.save()

                return res.status(201).json({
                    isSuccess: true,
                    status: 201,
                    message: "Avantage is saved !",
                Avantage,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        status: 500,
        message: 'Error when creating Avantage.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * AvantageController. updateAvantageById()
     */
    updateAvantageById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var Avantage = JSON.parse(req.body.Avantage)
        } else {
            var { Avantage
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    Avantage = typeof (Avantage) == "string" ? JSON.parse(Avantage) : Avantage

    if (!Avantage) {
        return res.status(422).json({
            isSuccess: false,
            status: 422,
            message: 'Missing params of Avantage.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(Avantage).length) {
        return res.status(500).json({
            isSuccess: false,
            status: 422,
            message: 'Empty Avantage !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    if (req?.files?.length) {
        const file = req?.files[0]
        fs.mkdir(process.cwd() + "/public/assets/files/Avantage", (err) => {
            if (err) console.log(err)
        })
        fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/Avantage/${file.filename}`, function (err) {
            if (err) throw err
            console.log('Successfully renamed - moved!')
        })

        Avantage.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/Avantage/${file.filename}`
      
    }

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

    Avantage.updated_at = Avantage?.updated_at ? Avantage.updated_at : new Date()

    delete Avantage?._id
    await AvantageModel.updateOne({ _id: id }, { ...Avantage })

    return res.status(200).json({
        isSuccess: true,
        status: 200,
        message: "Avantage is updated !",
                Avantage,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        status: 500,
        message: 'Error when updating Avantage.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * AvantageController.sortAvantageByPosition
     */
    sortAvantageByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await AvantageModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            status: 200,
            isSuccess: true,
            message: "Avantage sorted !",
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
     * AvantageController.removeAvantageById()
     */
    removeAvantageById: async (req, res) => {
        try {
            var id = req.params.id;

            const Avantage = await AvantageModel.findOne({ _id: id }, { imageUrl: true })
            if (Avantage) {
                // const old_image = Avantage.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await AvantageModel.deleteOne({ _id: id })


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
                message: 'Error when deleting Avantage.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
