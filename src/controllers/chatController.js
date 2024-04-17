/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 11/06/2023 19:35:08
 */

const fs = require('fs')
const moment = require('moment')
const ChatModel = require('../models/chatModel.js');
const chatModel = require('../models/chatModel.js');
const ManageChatModel = require('../models/manage_chatModel.js');
const ManageMessageModel = require('../models/manage_messageModel.js');
const messageModel = require('../models/messageModel.js');
const { log } = require('console');


/**
 * chatController.js
 *
 * @description :: Server-side logic for managing chats.
 */
module.exports = {

    /**
     * chatController.list()
     */
    list: async function (req, res) {
        try {
            const senderId = req.params.senderId
            const userId = req.userId
            let chat

            chat = await chatModel.findOne({
                $or: [
                    { participants: [senderId, userId] },
                    { participants: [userId, senderId] }
                ]
            })
                .populate("participants")
                .populate("lastMessage")
                .sort('-updated_at')

            if (!chat && senderId && userId) {
                chat = new chatModel({
                    participants: [senderId, userId]
                })
                chat.save()
            }

            return res.json({
                isSuccess: true,
                statusCode: 200,
                result: chat,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error when getting chat.',
                error: error
            })
        }
    },

    /**
    * chatController.listChatMessages()
    */
    listChatMessages: async function (req, res) {
        try {
            const chatId = req.params.chatId
            const userId = req.userId


            let messages = await messageModel.find({
                chatId: chatId,
                $or: [
                    { sender: userId },
                    { ownership: userId }
                ]
            })

            

            messages = await Promise.all(messages.map(async (message) => {
                let manageMessage = await ManageMessageModel.findOne({ 
                    userId: userId, 
                    messageId: message._id 
                })
                if(!manageMessage){
                    return message
                }
                if (manageMessage && manageMessage.clear) {
                    // removed !
                    return null
                }
                if (manageMessage && manageMessage.remove) {
                    // removed !
                    message.type = "TEXT"
                    message.fileUrl = ""
                    message.content = "message deleted"
                    return message
                }
                return message
            }))

            messages = messages.filter((message) => message !== null)


            // console.log({messages});
            return res.json({
                isSuccess: true,
                statusCode: 200,
                results: messages
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error when getting chat.',
                error: error
            })
        }
    },
    /**
     * chatController.listUnread()
     */
    listUnread: async function (req, res) {
        try {

            //console.log({senderId,userId});
            let messages = await messageModel.find({})

            console.log(messages);

            let data = {}

            messages.forEach(message => {
                const value = data[message.sender] || 0
                data[message.sender] = value + 1
            });

            return res.json(data);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error when getting chat.',
                error: error
            })
        }
    },
    readMessage: async function (req, res) {
        try {

            const chatId = req.params.chatId
            
            await messageModel.updateMany({chatId}, {
                $set: {isRead: true}
            })
            await chatModel.updateOne({_id: chatId}, {
                $set: {unReadMessageCount: 0}
            })

            

            return res.json({
                isSuccess: true
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error when getting chat.',
                error: error
            })
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * chatController.getChats()
     */
    getChatsByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await ChatModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let chats = await ChatModel.find({})
                .populate("participants")
                .populate("lastMessage")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            chats = chats.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: chats.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: chats.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * chatController.getChats()
     */
    getChats: async (req, res) => {
        try {
            const userId = req.params.userId

            const chats = await ChatModel.find({})
                .populate({
                    path: "participants",
                    select: "fullName email profile",
                    options: {
                        populate: "profile"
                    }
                })
                .populate("lastMessage")
                .sort("-created_at")


            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: chats.length,
                results: chats,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    getChatsByUser: async (req, res) => {
        try {
            const userId = req.params.userId

            // if(userId !== req.userId){
            //     return res.status(500).json({
            //         isSuccess: false,
            //         statusCode: 500,
            //         message: 'Not Authorized !',
            //         error: error,
            //         request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            //     });
            // }
            const archive = req.query.archive ? req.query.archive == "true" : false
            // const remove = req.query.remove ? req.query.remove : false
            
            let chats = await ChatModel.find({ participants: userId })
                .populate({
                    path: "participants",
                    select: "fullName email profile",
                    options: {
                        populate: "profile"
                    }
                })
                .populate("lastMessage")
                .sort("-updated_at")

            let  archiveCount = 0
            let  unarchiveCount = 0
            const length = chats.length
            chats = await Promise.all(chats.map(async (chat) => {
                const manageChat = await ManageChatModel.findOne({
                    userId: userId,
                    chatId: chat._id,
                })

                manageChat && manageChat.archive ? archiveCount++ : unarchiveCount++

                
                
                
                if (!manageChat && !archive) {
                    return chat
                }
                if (manageChat && manageChat.remove === true) {
                    return null
                }
                if (manageChat && manageChat.archive === archive) {
                    
                    
                   
                    return chat
                }



                
                return null
            }))
            
            console.log({archiveCount, unarchiveCount})
          



            chats = chats.filter(chat => chat !== null)





            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: chats.length,
                results: chats,
                archiveCount,
                unarchiveCount,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    archiveChat: async (req, res) => {
        try {
            const userId = req.params.userId
            const chatId = req.params.chatId
            let manageChat = await ManageChatModel.findOne({ userId: userId, chatId: chatId })

            if (!manageChat) {
                manageChat = new ManageChatModel({ userId: userId, chatId: chatId })
            }
            
            manageChat.archive = true


            await manageChat.save()

            return res.json({
                isSuccess: true,
                statusCode: 200,
                message: "Chat archived !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when archiving chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    unarchiveChat: async (req, res) => {
        try {
            const userId = req.params.userId
            const chatId = req.params.chatId
            await ManageChatModel.deleteOne({ userId: userId, chatId: chatId })


            return res.json({
                isSuccess: true,
                statusCode: 200,
                message: "Chat unarchived !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when unarchiving chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    removeChat: async (req, res) => {
        try {
            const userId = req.params.userId
            const chatId = req.params.chatId
            let manageChat = await ManageChatModel.findOne({ userId: userId, chatId: chatId })

            if (!manageChat) {
                manageChat = new ManageChatModel({ userId: userId, chatId: chatId })
            }

            manageChat.remove = true


            await manageChat.save()
            

            let messages = await messageModel.find({ 
                chatId: chatId ,
                $or: [
                    { sender: userId },
                    { ownership: userId }
                ]
            })

            while (messages.length) {
                const message = messages.shift()
                let manageMessage = await ManageMessageModel.findOne({ userId: userId, messageId: message._id })
                if (!manageMessage) {
                    manageMessage = new ManageMessageModel({ userId: userId, messageId: message._id })
                }
                manageMessage.clear = true
                console.log(manageMessage);
                manageMessage.save()
            }



            return res.json({
                isSuccess: true,
                statusCode: 200,
                message: "Chat removed !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when removing chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    removeMessage: async (req, res) => {
        try {
            const userId = req.params.userId
            const messageId = req.params.messageId

            let manageMessage = await ManageMessageModel.findOne({ userId: userId, messageId: messageId })

            if (!manageMessage) {
                manageMessage = new ManageMessageModel({ userId: userId, messageId: messageId })
            }
            manageMessage.remove = true

            manageMessage.save()



            return res.json({
                isSuccess: true,
                statusCode: 200,
                message: "Chat message removed !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when removing chat message.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    clearMessage: async (req, res) => {
        try {
            const userId = req.params.userId
            const messageId = req.params.messageId

            let manageMessage = await ManageMessageModel.findOne({ userId: userId, messageId: messageId })

            if (!manageMessage) {
                manageMessage = new ManageMessageModel({ userId: userId, messageId: messageId })
            }
            manageMessage.clear = true
            
            console.log(manageMessage)

            manageMessage.save()



            return res.json({
                isSuccess: true,
                statusCode: 200,
                message: "Chat message removed !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when removing chat message.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },


    getChatMessages: async function (req, res) {
        try {
            const chatId = req.params.chatId
            const userId = req.params.userId

            //console.log({senderId,userId});
            let messages = await messageModel.find({
                chatId: chatId,
                $or: [
                    { sender: userId },
                    { ownership: userId }
                ]
            })

            messages = await Promise.all(messages.map(async (message) => {
                let manageMessage = await ManageMessageModel.findOne({ userId: userId, messageId: message._id })
                if (manageMessage && manageMessage.remove) {
                    // removed !
                    message.type = "TEXT"
                    message.fileUrl = ""
                    message.content = "message deleted"
                }
                if (manageMessage && manageMessage.clear) {
                    // removed !
                    return null
                }
                return message
            }))

            messages = messages.filter((message) => message !== null)


            return res.json(messages);

        } catch (error) {
            return res.status(500).json({
                message: 'Error when getting chat.',
                error: error
            })
        }
        /*
        ChatModel.find(function (err, chats) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting chat.',
                    error: err
                });
            }

            return res.json(chats);
        });
        */
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * chatController.showChatById()
     */
    searchChatByTag: async (req, res) => {
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

            let allCount = await ChatModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let chats = await ChatModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            chats = chats.map((item) => {
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
                results: chats.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * chatController.showChatById()
     */
    showChatById: async (req, res) => {
        try {
            const id = req.params.id;
            const chat = await ChatModel.findOne({ _id: id })

            if (!chat) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such chat',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: chat,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
        /**
         * Generate By Mudey Formation (https://mudey.fr)
         * chatController.showChatById()
         */
        showChatBySlug: async (req, res) => {
            try {
                const id = req.params.slug;
                const chat = await ChatModel.findOne({ slug: slug })

                if (!chat) {
                    return res.status(404).json({
                        isSuccess: false,
                        statusCode: 404,
                        message: 'No such chat',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    statusCode: 200,
                    result: chat,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            } catch (error) {

                console.log(error);

                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when getting chat.',
                    error: error,
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * chatController.createChat()
     */
    createChat: async (req, res) => {
        try {


            if (req?.files?.lenth) {
                var chat = JSON.parse(req.body.chat)
            } else {
                var { chat
                } = req.body
            }

            chat = typeof (chat) === "string" ? JSON.parse(chat) : chat
            console.log(req.body)

            if (!chat) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of chat.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(chat).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty chat !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/chat", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/chat/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                chat.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/chat/${file.filename}`

            }

            chat = new ChatModel({ ...chat })

            chat.created_at = chat?.created_at ? chat.created_at : new Date()

            await chat.save()

            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "chat is saved !",
                chat,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * chatController. updateChatById()
     */
    updateChatById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var chat = JSON.parse(req.body.chat)
            } else {
                var { chat
                } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            chat = typeof (chat) == "string" ? JSON.parse(chat) : chat

            if (!chat) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of chat.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(chat).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty chat !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/chat", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/chat/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                chat.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/chat/${file.filename}`

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

            chat.updated_at = chat?.updated_at ? chat.updated_at : new Date()

            delete chat?._id
            await ChatModel.updateOne({ _id: id }, { ...chat })

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "chat is updated !",
                chat,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * chatController.sortChatByPosition
     */
    sortChatByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await ChatModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "chat sorted !",
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
     * chatController.removeChatById()
     */
    removeChatById: async (req, res) => {
        try {
            var id = req.params.id;

            const chat = await ChatModel.findOne({ _id: id }, { imageUrl: true })
            if (chat) {
                // const old_image = chat.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await ChatModel.deleteOne({ _id: id })


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
                message: 'Error when deleting chat.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
