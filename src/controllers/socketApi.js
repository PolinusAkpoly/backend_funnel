const chatModel = require('../models/chatModel');
const ManageChatModel = require('../models/manage_chatModel');
const messageModel = require('../models/messageModel');

module.exports = {
    saveNewMessage: async (message)=>{
        const newMessage = new messageModel({
            ...message
        })
        let chat 
        
        if(message.chatId){
            chat = await chatModel.findOne({_id: message.chatId})
        }else{
            chat = await chatModel.findOne({
                $or: [
                    { participants: [message.sender, message.ownership] },
                    { participants: [message.ownership, message.sender] }
                ]
            })

        }
       
        if(!chat){
            const newChat = new chatModel({
                participants:[message.sender, message.ownership],
                lastMessage: newMessage._id,
                unReadMessageCount: 1,
                updated_at: newMessage.created_at,
            })
            await newChat.save()
            newMessage.chatId = newChat._id
            await newMessage.save()
        }else{
            newMessage.chatId = chat._id
            chat.lastMessage = newMessage._id
            chat.unReadMessageCount++
            chat.updated_at = newMessage.created_at
            await newMessage.save()
            await chat.save()
        }
        const manageChat = await ManageChatModel.findOne({
            chatId: message.chatId,
            userId: message.ownership
        })
        if(manageChat && manageChat.remove){
            manageChat.remove = false 
            manageChat.archive = false 
            await manageChat.save()
        }
        return newMessage
    },
    broadCast: (message, socket) =>{
       //socket
       // console.log("broadCast : ", message);

    }
};