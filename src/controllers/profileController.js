/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 14/06/2023 17:08:10
 */

const fs = require('fs')
const moment = require('moment')
const ProfileModel = require('../models/profileModel.js');
const userModel = require('../models/userModel.js');
const friend_requestModel = require('../models/friend_requestModel.js');
const { updateFriend } = require('../helpers/utils.js');


/**
 * profileController.js
 *
 * @description :: Server-side logic for managing profiles.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * profileController.getProfiles()
     */
    getProfilesByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await ProfileModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let profiles = await ProfileModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            profiles = profiles.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: profiles.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: profiles.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * profileController.getProfiles()
     */
    getProfiles: async (req, res) => {
        try {
            const profiles = await ProfileModel.find({})
            // .populate('pr')

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: profiles.length,
                results: profiles,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * profileController.showProfileById()
     */
    searchProfileByTag: async (req, res) => {
        try {

            let filter = {}
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5



            const email = req.query?.email ? new RegExp(req.query.email, 'i') : null
            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const user = req.query?.user ? req.query.user : null
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
            if (user) {
                filter.user = user
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

            let allCount = await ProfileModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let profiles = await ProfileModel.find(filter)
                .populate('categories')
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .populate({
                    path: "user",
                    select: "_id fullName phone",
                    options: {
                        sort: { 'created_at': -1 }
                    }
                })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            if (!profiles.length && user) {
                const profile = new ProfileModel({ user: user })
                profile.save()
                profiles = [profile]
            }


            profiles = await Promise.all(profiles.map(async (profil) => {
                const { user } = profil

                await updateFriend(req.userId)
                await updateFriend(user._id)
                const has_friend_request = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                        },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                        },
                    ]
                })
                const request_received = await friend_requestModel.findOne({
                    $or: [
                        // {
                        //     ownerId: req.userId,
                        //     senderId: user._id,
                        // },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                            statusCode: "ASQ"
                        },
                    ]
                })
                const request_sended = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                            statusCode: "ASQ"
                        },
                        // {
                        //     ownerId: user._id,
                        //     senderId: req.userId,
                        //     statusCode: "ASQ"
                        // },
                    ]
                })
                const is_my_friend = await friend_requestModel.findOne({
                    $or: [
                        {
                            ownerId: req.userId,
                            senderId: user._id,
                            statusCode: "ACCEPT"
                        },
                        {
                            ownerId: user._id,
                            senderId: req.userId,
                            statusCode: "ACCEPT"
                        },
                    ]
                })
                user.has_friend_request = has_friend_request ? true : false
                user.request_received = request_received ? true : false
                user.request_sended = request_sended ? true : false
                user.is_my_friend = is_my_friend ? true : false

                profil.created_formatted_with_time_since = moment(profil?.created_at).fromNow()

                profil.user = user
                return profil
            }))

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                filter: req.query,
                resultCount: allCount,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: profiles.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * profileController.showProfileById()
     */
    showProfileById: async (req, res) => {
        try {
            const id = req.params.id;
            const profile = await ProfileModel.findOne({ _id: id })

            if (!profile) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such profile',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: profile,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * profileController.showProfileById()
         */
        showProfileBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const profile = await ProfileModel.findOne({ slug: slug })

                if (!profile) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such profile',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: profile,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting profile.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * profileController.createProfile()
     */
    createProfile: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var profile = JSON.parse(req.body.profile)
            } else {
                var { profile
                } = req.body
            }

            profile = typeof (profile) === "string" ? JSON.parse(profile) : profile
            console.log(req.body)


            if (!profile) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of profile.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(profile).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty profile !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }



            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/profile", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/profile/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                profile.picture = `${req.protocol}://${req.get('host')}/assets/files/profile/${file.filename}`

            }

            profile = new ProfileModel({ ...profile })

            profile.created_at = profile?.created_at ? profile.created_at : new Date()

            await profile.save()


            await userModel.updateOne({ _id: profile.user }, { $set: { profile: profile } })

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "profile is saved !",
                profile,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * profileController. updateProfileById()
     */
    updateProfileById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var profile = JSON.parse(req.body.profile)
            } else {
                var { profile } = req.body
            }




            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            profile = typeof (profile) == "string" ? JSON.parse(profile) : profile




            if (!profile) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of profile.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(profile).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty profile !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }



            if (req?.files?.length) {
                const file = req?.files[0]
                console.log({ file });
                fs.mkdir(process.cwd() + "/public/assets/files/profile", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/profile/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                profile[file.originalname.split(".")[0]] = `${req.protocol}://${req.get('host')}/assets/files/profile/${file.filename}`
                const oldProfile = await ProfileModel.findById(profile._id)
                if (oldProfile) {

                    const currentFileUrl = oldProfile[file.originalname.split(".")[0]]
                    if (currentFileUrl) {
                        const filename = "public/assets/" + currentFileUrl.split('/assets/')[1];
                        console.log({ filename });
                        fs.unlink(filename, (err) => {
                            if (err) {
                                console.log(err.message);
                            }
                        });
                    }


                }
            }


            profile.updated_at = profile?.updated_at ? profile.updated_at : new Date()

            delete profile?._id
            await ProfileModel.updateOne({ _id: id }, { ...profile })

            const data = await userModel.updateOne({ _id: profile.user }, { $set: { profile: id } })

            if (profile?.user?.email) {
                await userModel.updateOne({ _id: profile.user }, { $set: { email: profile?.user?.email } })
            }
            if (profile?.user?.fullName) {
                await userModel.updateOne({ _id: profile.user }, { $set: { fullName: profile?.user?.fullName } })
            }
            if (profile?.user?.phone) {
                await userModel.updateOne({ _id: profile.user }, { $set: { phone: profile?.user?.phone } })
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "profile is updated !",
                profile,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * profileController.sortProfileByPosition
     */
    sortProfileByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await ProfileModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "profile sorted !",
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
     * profileController.removeProfileById()
     */
    removeProfileById: async (req, res) => {
        try {
            var id = req.params.id;

            const profile = await ProfileModel.findOne({ _id: id }, { picture: true })
            if (profile) {
                // const old_image = profile.picture
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await ProfileModel.deleteOne({ _id: id })


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
                message: 'Error when deleting profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
