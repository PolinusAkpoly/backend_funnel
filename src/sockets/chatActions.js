const { saveNewMessage } = require('../controllers/socketApi');
const { uniqueId } = require('../helpers/utils');
const socketModel = require('../models/socketModel');
const userModel = require('../models/userModel');
const {writeFile} = require('fs');

module.exports = {
    intChatActions: (io, socket) => {

        socket.on('userDisconnected', async (userId, socketId) => {
            console.log('A user disconnected', userId);
            await socketModel.deleteOne({
                socketId: socketId
            })
            socket.leave
        });

        socket.on('logout', async () => {
            console.log('A user disconnected', socket.id);

            await socketModel.deleteOne({
                socketId: socket.id
            })

            socket.leave
        });

        socket.on('disconnect', async () => {
            console.log('A user disconnected', socket.id);

            await socketModel.deleteOne({
                socketId: socket.id
            })

            socket.leave
        });
        socket.on('message', async (message) => {
            const newMessage = await saveNewMessage(message)
         
            io.to(message.ownership).emit("newMessage", newMessage);
            io.to(message.sender).emit("newMessage", newMessage);

            // EMAIL NOTIFICATION
            // if (newMessage.ownership?.toString() != newMessage.sender?.toString()) {
            //     const realUser = await userModel.findOne({ _id: newMessage.sender })

            //     console.log(realUser.email);
            //     const clientOrigin = socket.handshake.headers.origin
            //     const data = {
            //         link: clientOrigin,
            //         signin: clientOrigin + "/signin"
            //     }
            //     // notificationChat(realUser, newMessage, data)
            // }

            //clear database 

        });
       

        socket.on("error", (err) => {
            if (err && err.message === "unauthorized event") {
                socket.disconnect();
            }
        });

        socket.on("messageWithFiles", async (files, datas, callback) => {
            const { type, message } = datas
            console.log({files}); // <Buffer 25 50 44 ...>

            message.fileUrls = []

            files.forEach(async (file) => {
                const name = uniqueId()

                const extension = type.split("/")[1]
                // save the content to the disk, for example
                const fileUrl = process.cwd() + "/public/assets/files/messages/" + name + '.' + extension
                const host = socket.handshake.headers.host
                message.fileUrls.push("http://" + host + "/assets/files/messages/" + name + '.' + extension)

                writeFile(fileUrl, file, async (err) => {
                    console.log({ err });
                });

            });

            const newMessage = await saveNewMessage(message)
            io.to(message.ownership).emit("newMessage", newMessage);
            io.to(message.sender).emit("newMessage", newMessage);
        });
    }
}