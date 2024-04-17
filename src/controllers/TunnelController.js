/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:19:59
 */

const fs = require('fs')
const moment = require('moment')
const TunnelModel = require('../models/TunnelModel.js');


/**
 * TunnelController.js
 *
 * @description :: Server-side logic for managing Tunnels.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController.getTunnels()
     */
    getTunnelsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await TunnelModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let Tunnels = await TunnelModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Tunnels = Tunnels.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: Tunnels.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: Tunnels.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    showTunnelByUserId: async (req, res) => {
        try {
            let tag = req.query.tag || "";
            let pageNumber = parseInt(req.query.pageNumber) || 1;
            let pageLimit = parseInt(req.query.pageLimit) || 5;

            let allCount;
            let Tunnels;

            if (tag) {
                // Filtrer par tag dans le nom ou la description
                allCount = await TunnelModel.find({
                    userId: req.userId,
                    $or: [
                        { name: { $regex: tag, $options: "i" } },
                        { description: { $regex: tag, $options: "i" } },
                    ],
                }).count();

                Tunnels = await TunnelModel.find({
                    userId: req.userId,
                    $or: [
                        { name: { $regex: tag, $options: "i" } },
                        { description: { $regex: tag, $options: "i" } },
                    ],
                })
                    .sort("-created_at")
                    .skip((pageNumber - 1) * pageLimit)
                    .limit(pageLimit);
            } else {
                // Aucun filtre par tag
                allCount = await TunnelModel.find({ userId: req.userId }).count();

                Tunnels = await TunnelModel.find({ userId: req.userId })
                    .sort("-created_at")
                    .skip((pageNumber - 1) * pageLimit)
                    .limit(pageLimit);
            }

            Tunnels = Tunnels.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow();
                return item;
            });

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: Tunnels.length,
                current: pageNumber,
                next: allCount > pageNumber * pageLimit ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: Tunnels.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss"),
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss"),
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController.getTunnels()
     */
    getTunnels: async (req, res) => {
        try {
            const Tunnels = await TunnelModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: Tunnels.length,
                results: Tunnels,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController.showTunnelById()
     */
    searchTunnelByTag: async (req, res) => {
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

            let allCount = await TunnelModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let Tunnels = await TunnelModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            Tunnels = Tunnels.map((item) => {
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
                results: Tunnels.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController.showTunnelById()
     */
    showTunnelById: async (req, res) => {
        try {
            const id = req.params.id;
            const Tunnel = await TunnelModel.findOne({ _id: id })
                .populate({
                    path: 'steps',
                    populate: {
                        path: 'type',
                    },
                    options: {
                        sort: { position: 1 }  // Utilisez 1 pour un tri croissant, -1 pour un tri décroissant
                    }
                });

            if (!Tunnel) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such Tunnel',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: Tunnel,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },


    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController.showTunnelById()
     */
    showTunnelBySlug: async (req, res) => {
        try {
            const id = req.params.slug;
            const Tunnel = await TunnelModel.findOne({ slug: slug })

            if (!Tunnel) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such Tunnel',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: Tunnel,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }

    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController.createTunnel()
     */
    createTunnel: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var Tunnel = JSON.parse(req.body.Tunnel)
            } else {
                var { Tunnel
                } = req.body
            }

            Tunnel = typeof (Tunnel) === "string" ? JSON.parse(Tunnel) : Tunnel
            console.log(req.body)

            if (!Tunnel) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of Tunnel.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(Tunnel).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty Tunnel !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/Tunnel", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/Tunnel/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                Tunnel.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/Tunnel/${file.filename}`

            }

            Tunnel = new TunnelModel({ ...Tunnel })

            Tunnel.created_at = Tunnel?.created_at ? Tunnel.created_at : new Date()
            Tunnel.userId = req.userId

            await Tunnel.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "Tunnel is saved !",
                result: Tunnel,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController. updateTunnelById()
     */
    updateTunnelById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var Tunnel = JSON.parse(req.body.Tunnel)
            } else {
                var { Tunnel } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            Tunnel = typeof (Tunnel) == "string" ? JSON.parse(Tunnel) : Tunnel

            if (!Tunnel) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of Tunnel.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(Tunnel).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty Tunnel !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/Tunnel", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/Tunnel/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                Tunnel.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/Tunnel/${file.filename}`

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

           
            delete Tunnel?._id
            await TunnelModel.updateOne({ _id: id }, { ...Tunnel, updated_at: new Date() })
            Tunnel = await TunnelModel.findOne({ _id: id })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "Tunnel is updated !",
                result: Tunnel,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * TunnelController.sortTunnelByPosition
     */
    sortTunnelByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await TunnelModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "Tunnel sorted !",
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
     * TunnelController.removeTunnelById()
     */
    removeTunnelById: async (req, res) => {
        try {
            var id = req.params.id;

            const Tunnel = await TunnelModel.findOne({ _id: id }, { imageUrl: true })
            if (Tunnel) {
                // const old_image = Tunnel.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await TunnelModel.deleteOne({ _id: id })


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
                message: 'Error when deleting Tunnel.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
