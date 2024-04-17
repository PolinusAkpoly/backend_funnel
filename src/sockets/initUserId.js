const socketModel = require("../models/socketModel");


module.exports = {
    initUserId: async (io, socket) => {

        // console.log('A user connected', socket.id);

        // let allSockets = io.sockets.sockets;

        // let users = await socketModel.find({})

        // const onlines = Array.from(allSockets, function (entry) {
        //     return entry[0]
        // });

        // users.forEach(async (user) => {
        //     if (!onlines.includes(user.socketId)) {
        //         await socketModel.deleteOne({ socketId: user.socketId })
        //     }
        // })

        socket.on("initUserId", async (userId) => {
            console.log('initUserId', userId);
            socket.join(userId);
            // try {
            //     if (userId) {
            //         await socketModel.deleteOne({ socketId: socket.id, userId: userId })
            //         const socketData = socketModel({
            //             userId: userId,
            //             socketId: socket.id,
            //             address: socket.handshake.address
            //         })
            //         await socketData.save()
            //     }
            // } catch (error) {
            //     console.log("error");
            // }
        })

    }
}