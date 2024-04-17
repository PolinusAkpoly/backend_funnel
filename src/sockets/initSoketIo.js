
const socketModel = require('../models/socketModel');
const { intChatActions } = require('./chatActions');
const { initUploadFile } = require('./initUploadFileActions');
const {initUserId} = require('./initUserId');
const { intPostActions } = require('./postActions');


module.exports = {
    initSocketIo: (server) => {
        try {
            var io = require('socket.io')(server, { 
                cors: { origin: '*', } ,
                maxHttpBufferSize: 1e32,
            })
           

            io.on('connection', async function (socket) {
                initUserId(io, socket)
                intPostActions(io, socket)
                intChatActions(io, socket)
            })

            return io

        } catch (error) {
            console.log(error);
            return null
        }
    }
}
