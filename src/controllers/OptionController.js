
/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/02/2024 15:15:07
 */

const fs = require('fs')
const moment = require('moment')
const OptionModel = require('../models/OptionModel.js');


/**
 * OptionController.js
 *
 * @description :: Server-side logic for managing Options.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OptionController.getOptions()
     */
    getOptionsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await OptionModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let Options = await OptionModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Options = Options.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: Options.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: Options.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Option.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OptionController.getOptions()
     */
    getOptions: async (req, res) => {
        try {
            const Options = await OptionModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: Options.length,
                results: Options,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Option.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OptionController.showOptionById()
     */
    searchOptionByTag: async (req, res) => {
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

            let allCount = await OptionModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let Options = await OptionModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Options = Options.map((item) => {
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
                results: Options.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Option.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * OptionController.showOptionById()
         */
        showOptionById: async (req, res) => {
            try {
                const id = req.params.id;
                const Option = await OptionModel.findOne({ _id: id })

                if (!Option) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such Option',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: Option,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting Option.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * OptionController.showOptionById()
         */
        showOptionBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const Option = await OptionModel.findOne({ slug: slug })

                if (!Option) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such Option',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: Option,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting Option.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
        },

            /**
             * Generate By Mudey Formation (https://mudey.fr)
             * OptionController.createOption()
             */
            createOption: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var Option = JSON.parse(req.body.Option)
                    } else {
                        var { Option
                    } = req.body
                }

        Option = typeof (Option) === "string" ? JSON.parse(Option) : Option
                console.log(req.body)

                if (!Option) {
                    return res.status(422).json({
                        isSuccess: false,
                        status: 422,
                        message: 'Missing params of Option.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(Option).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        status: 422,
                        message: 'Empty Option !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/Option", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/Option/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    Option.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/Option/${file.filename}`
                   
                }

                Option = new OptionModel({ ...Option })

                Option.created_at = Option?.created_at ? Option.created_at : new Date()

                await Option.save()

                return res.status(201).json({
                    isSuccess: true,
                    status: 201,
                    message: "Option is saved !",
                Option,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        status: 500,
        message: 'Error when creating Option.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OptionController. updateOptionById()
     */
    updateOptionById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var Option = JSON.parse(req.body.Option)
        } else {
            var { Option
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    Option = typeof (Option) == "string" ? JSON.parse(Option) : Option

    if (!Option) {
        return res.status(422).json({
            isSuccess: false,
            status: 422,
            message: 'Missing params of Option.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(Option).length) {
        return res.status(500).json({
            isSuccess: false,
            status: 422,
            message: 'Empty Option !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    if (req?.files?.length) {
        const file = req?.files[0]
        fs.mkdir(process.cwd() + "/public/assets/files/Option", (err) => {
            if (err) console.log(err)
        })
        fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/Option/${file.filename}`, function (err) {
            if (err) throw err
            console.log('Successfully renamed - moved!')
        })

        Option.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/Option/${file.filename}`
      
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

    Option.updated_at = Option?.updated_at ? Option.updated_at : new Date()

    delete Option?._id
    await OptionModel.updateOne({ _id: id }, { ...Option })

    return res.status(200).json({
        isSuccess: true,
        status: 200,
        message: "Option is updated !",
                Option,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        status: 500,
        message: 'Error when updating Option.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * OptionController.sortOptionByPosition
     */
    sortOptionByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await OptionModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            status: 200,
            isSuccess: true,
            message: "Option sorted !",
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
     * OptionController.removeOptionById()
     */
    removeOptionById: async (req, res) => {
        try {
            var id = req.params.id;

            const Option = await OptionModel.findOne({ _id: id }, { imageUrl: true })
            if (Option) {
                // const old_image = Option.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await OptionModel.deleteOne({ _id: id })


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
                message: 'Error when deleting Option.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
