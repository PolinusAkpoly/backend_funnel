/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 26/11/2023 18:11:04
 */

const fs = require('fs')
const moment = require('moment')
const ClientdataModel = require('../models/clientDataModel.js');


/**
 * clientDataController.js
 *
 * @description :: Server-side logic for managing clientDatas.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * clientDataController.getClientdatas()
     */
    getClientdatasByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await ClientdataModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let clientDatas = await ClientdataModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            clientDatas = clientDatas.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: clientDatas.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: clientDatas.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting clientData.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * clientDataController.getClientdatas()
     */
    getClientdatas: async (req, res) => {
        try {
            const clientDatas = await ClientdataModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: clientDatas.length,
                results: clientDatas,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting clientData.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * clientDataController.showClientdataById()
     */
    searchClientdataByTag: async (req, res) => {
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

            let allCount = await ClientdataModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let clientDatas = await ClientdataModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            clientDatas = clientDatas.map((item) => {
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
                results: clientDatas.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting clientData.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * clientDataController.showClientdataById()
         */
        showClientdataById: async (req, res) => {
            try {
                const id = req.params.id;
                const clientData = await ClientdataModel.findOne({ _id: id })

                if (!clientData) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such clientData',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: clientData,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting clientData.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * clientDataController.showClientdataById()
         */
        showClientdataBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const clientData = await ClientdataModel.findOne({ slug: slug })

                if (!clientData) {
                    return res.status(404).json({
                        isSuccess: false,
                        status: 404,
                        message: 'No such clientData',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    status: 200,
                    result: clientData,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    status: 500,
                    message: 'Error when getting clientData.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
        },

            /**
             * Generate By Mudey Formation (https://mudey.fr)
             * clientDataController.createClientdata()
             */
            createClientdata: async (req, res) => {
                try {


                    if (req?.files?.lenth) {
                        var clientData = JSON.parse(req.body.clientData)
                    } else {
                        var { clientData
                    } = req.body
                }

        clientData = typeof (clientData) === "string" ? JSON.parse(clientData) : clientData
                console.log(req.body)

                if (!clientData) {
                    return res.status(422).json({
                        isSuccess: false,
                        status: 422,
                        message: 'Missing params of clientData.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (!Object.keys(clientData).length) {
                    return res.status(422).json({
                        isSuccess: false,
                        status: 422,
                        message: 'Empty clientData !',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                if (req?.files?.length) {
                    const file = req?.files[0]
                    fs.mkdir(process.cwd() + "/public/assets/files/clientData", (err) => {
                        if (err) console.log(err)
                    })
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/clientData/${file.filename}`, function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - moved!')
                    })

                    clientData.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/clientData/${file.filename}`
                   
                }

                clientData = new ClientdataModel({ ...clientData })

                clientData.created_at = clientData?.created_at ? clientData.created_at : new Date()

                await clientData.save()

                return res.status(201).json({
                    isSuccess: true,
                    status: 201,
                    message: "clientData is saved !",
                clientData,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        status: 500,
        message: 'Error when creating clientData.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * clientDataController. updateClientdataById()
     */
    updateClientdataById: async (req, res) => {
    try {
        const id = req.params.id;
        if (req?.files?.length) {
            var clientData = JSON.parse(req.body.clientData)
        } else {
            var { clientData
        } = req.body
    }
        try {
        var deleteFiles = JSON.parse(req.body?.deleteFiles)

    } catch (error) {
        var deleteFiles = []

    }
    clientData = typeof (clientData) == "string" ? JSON.parse(clientData) : clientData

    if (!clientData) {
        return res.status(422).json({
            isSuccess: false,
            status: 422,
            message: 'Missing params of clientData.',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }
    if (!Object.keys(clientData).length) {
        return res.status(500).json({
            isSuccess: false,
            status: 422,
            message: 'Empty clientData !',
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        });
    }

    if (req?.files?.length) {
        const file = req?.files[0]
        fs.mkdir(process.cwd() + "/public/assets/files/clientData", (err) => {
            if (err) console.log(err)
        })
        fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/clientData/${file.filename}`, function (err) {
            if (err) throw err
            console.log('Successfully renamed - moved!')
        })

        clientData.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/clientData/${file.filename}`
      
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

    clientData.updated_at = clientData?.updated_at ? clientData.updated_at : new Date()

    delete clientData?._id
    await ClientdataModel.updateOne({ _id: id }, { ...clientData })

    return res.status(200).json({
        isSuccess: true,
        status: 200,
        message: "clientData is updated !",
                clientData,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

    } catch (error) {
    console.log(error);

    return res.status(500).json({
        isSuccess: false,
        status: 500,
        message: 'Error when updating clientData.',
        error: error,
        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
    });
}
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * clientDataController.sortClientdataByPosition
     */
    sortClientdataByPosition: (req, res) => {
    try {

        const { datas } = req.body

        datas.forEach(async (elt) => {
            await ClientdataModel.updateOne({ _id: elt._id }, {
                $set: { position: elt.position }
            })
        });


        return res.status(200).json({
            status: 200,
            isSuccess: true,
            message: "clientData sorted !",
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
     * clientDataController.removeClientdataById()
     */
    removeClientdataById: async (req, res) => {
        try {
            var id = req.params.id;

            const clientData = await ClientdataModel.findOne({ _id: id }, { imageUrl: true })
            if (clientData) {
                // const old_image = clientData.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await ClientdataModel.deleteOne({ _id: id })


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
                message: 'Error when deleting clientData.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
