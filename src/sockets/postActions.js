const { saveNewMessage } = require('../controllers/socketApi');
const { uniqueId, getFriendsId } = require('../helpers/utils');
const postModel = require('../models/postModel');
const socketModel = require('../models/socketModel');
const userModel = require('../models/userModel');
const { writeFile } = require('fs');

module.exports = {
    intPostActions: (io, socket) => {


        socket.on('post', async (post) => {
            const newPost = new postModel(post)
            await newPost.save()

            const newPostSaved = await postModel.findOne({ _id: newPost._id })
                                                .populate({
                                                    path:"with_friends",
                                                    select: "_id fullName firstname lastname",
                                                    options: {
                                                        populate: "profile"
                                                    }
                                                })
                                                .populate({
                                                    path:"ownership",
                                                    select: "_id fullName firstname lastname",
                                                    options: {
                                                        populate: "profile"
                                                    }
                                                })
            
            if (newPostSaved.visibility == "PUBLIC") {
                io.emit("newPost", newPostSaved);
            }
            if (newPostSaved.visibility == "PRIVATE") {
                socket.emit("newPost", newPostSaved);
            }
            if (newPostSaved.visibility == "FRIENDS") {
                socket.emit("newPost", newPostSaved);
                const friendsId = await getFriendsId(newPostSaved.ownership._id)
                friendsId.forEach((userId) => {
                    io.to(userId).emit("newPost", newPostSaved);
                });
            }

        });




        socket.on("postWithFiles", async (files, datas, callback) => {
            const { type, post } = datas
            console.log({files}); // <Buffer 25 50 44 ...>
            post.fileUrls = []
            files.forEach(async (file) => {
                const name = uniqueId()

                const extension = type.split("/")[1]
                // save the content to the disk, for example
                const fileUrl = process.cwd() + "/public/assets/files/posts/" + name + '.' + extension
                const host = socket.handshake.headers.host
                post.fileUrls.push("http://" + host + "/assets/files/posts/" + name + '.' + extension)

                writeFile(fileUrl, file, async (err) => {
                    console.log({ err });
                });

            });
            console.log(post.fileUrls)
            const newPost = new postModel(post)

            await newPost.save()

            const newPostSaved = await postModel.findOne({ _id: newPost._id })
                                                .populate({
                                                    path:"with_friends",
                                                    select: "_id fullName firstname lastname",
                                                    options: {
                                                        populate: "profile"
                                                    }
                                                })
                                                .populate({
                                                    path:"ownership",
                                                    select: "_id fullName firstname lastname",
                                                    options: {
                                                        populate: "profile"
                                                    }
                                                })

            if (newPostSaved.visibility == "PUBLIC") {
                io.emit("newPost", newPostSaved);
            }
            if (newPostSaved.visibility == "PRIVATE") {
                socket.emit("newPost", newPostSaved);
            }
            if (newPostSaved.visibility == "FRIENDS") {
                if (newPostSaved.visibility == "FRIENDS") {
                    const friendsId = await getFriendsId(newPostSaved.ownership._id)
                    friendsId.forEach((userId) => {
                        io.to(userId).emit("newPost", newPostSaved);
                    });
                }
            }
            callback({ message: false ? "failure" : "success" });
        });
    }
}