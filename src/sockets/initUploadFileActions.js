

module.exports = {
    initUploadFile: async (io, socket) =>{
        socket.on('file', async (file) => {
            console.log(file);
        });
    }
}