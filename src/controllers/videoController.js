/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 10:59:34
 */

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const VideoModel = require('../models/videoModel.js');
const ffmpeg = require('fluent-ffmpeg');
const { getVideosMetadatas, formatDuration, deleteVideoFiles } = require('../helpers/videoHelpers.js');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const videoModel = require('../models/videoModel.js');
const videoResolutionModel = require('../models/videoResolutionModel.js');
const { generateRandomString } = require('../helpers/utils.js');


/**
 * videoController.js
 *
 * @description :: Server-side logic for managing videos.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.getVideos()
     */
    watchVideo: async (req, res) => {
        try {

            const uniqueCode = req.params.uniqueCode;
            let videoStream

            console.log({
                uniqueCode: uniqueCode,
                author: req.userId
            });

            const video = await videoModel.findOne({
                uniqueCode: uniqueCode,
                author: req.userId
            });

            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Vidéo non trouvée'
                });
            }

            const videoPath = process.cwd() + video.filePath;

            // Vérifiez si le fichier vidéo existe
            if (!fs.existsSync(videoPath)) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Fichier vidéo non trouvé'
                });
            }

            // Obtenez les informations sur la taille du fichier vidéo
            const stat = fs.statSync(videoPath);
            const fileSize = stat.size;

            // Obtenez les en-têtes de plage de la demande
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;

                // Définissez les en-têtes de réponse pour la plage
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4'
                });

                // Créez un flux de lecture à partir du fichier vidéo avec la plage spécifiée
                videoStream = fs.createReadStream(videoPath, { start, end });

                // Passez le flux de lecture de la vidéo à la réponse HTTP
                videoStream.pipe(res);
            } else {
                // Si aucune plage n'est spécifiée, renvoyez la vidéo entière
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4'
                });

                // Créez un flux de lecture à partir du fichier vidéo complet
                videoStream = fs.createReadStream(videoPath);

                // Passez le flux de lecture de la vidéo à la réponse HTTP
                videoStream.pipe(res);
            }

            // Gestion des erreurs de lecture
            videoStream.on('error', (err) => {
                console.error('Erreur lors de la lecture de la vidéo :', err);
                res.status(500).send('Erreur lors de la lecture de la vidéo.');
            });
        } catch (err) {
            console.error('Erreur lors de la lecture de la vidéo :', err);
            res.status(500).send('Erreur lors de la lecture de la vidéo.');
        }
    },
    readVideo: async (req, res) => {
        try {

            const videoId = req.params.videoId;
            let videoStream

            const video = await videoModel.findOne({ _id: videoId });

            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Vidéo non trouvée'
                });
            }

            const videoPath = process.cwd() + video.filePath;

            // Vérifiez si le fichier vidéo existe
            if (!fs.existsSync(videoPath)) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Fichier vidéo non trouvé'
                });
            }

            // Obtenez les informations sur la taille du fichier vidéo
            const stat = fs.statSync(videoPath);
            const fileSize = stat.size;

            // Obtenez les en-têtes de plage de la demande
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;

                // Définissez les en-têtes de réponse pour la plage
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4'
                });

                // Créez un flux de lecture à partir du fichier vidéo avec la plage spécifiée
                videoStream = fs.createReadStream(videoPath, { start, end });

                // Passez le flux de lecture de la vidéo à la réponse HTTP
                videoStream.pipe(res);
            } else {
                // Si aucune plage n'est spécifiée, renvoyez la vidéo entière
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4'
                });

                // Créez un flux de lecture à partir du fichier vidéo complet
                videoStream = fs.createReadStream(videoPath);

                // Passez le flux de lecture de la vidéo à la réponse HTTP
                videoStream.pipe(res);
            }

            // Gestion des erreurs de lecture
            videoStream.on('error', (err) => {
                console.error('Erreur lors de la lecture de la vidéo :', err);
                res.status(500).send('Erreur lors de la lecture de la vidéo.');
            });
        } catch (err) {
            console.error('Erreur lors de la lecture de la vidéo :', err);
            res.status(500).send('Erreur lors de la lecture de la vidéo.');
        }
    },
    lectorVideo: async (req, res) => {
        try {
            let origin = req.headers.origin || req.headers.referer || 'Unknown';
            console.log({ lector: origin });

            const range = req.headers.range;
            const isInitialRequest = !range || range === 'bytes=0-';

            
            if(origin === 'Unknown'){
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Vidéo non trouvée'
                });
            }
            if(origin === 'https://www.gstatic.com'){
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Vidéo non trouvée'
                });
            }
    
            const uniqueCode = req.params.uniqueCode;
            let resolution;
    
            if (req.query?.resolution) {
                resolution = req.query.resolution;
            } else {
                const ouitubeplayerCookie = req.cookies?.ouitubeplayer;
                if (ouitubeplayerCookie) {
                    const parsedOuitubeplayer = JSON.parse(ouitubeplayerCookie);
    
                    // Récupère la valeur de 'defaultResolution' de l'objet analysé
                    resolution = parsedOuitubeplayer?.defaultResolution || 'SD';
                } else {
                    resolution = 'SD';
                }
            }
    
            console.log({ resolution });
    
            let video = await videoModel.findOne({ uniqueCode: uniqueCode });
    
            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Vidéo non trouvée'
                });
            }
            // if (isInitialRequest) {
            //     if (video.status !== 'Completed' && video.status !== 'Priority' && video.status !== 'In Progress') {
            //         video.status = 'Priority';
            //         await video.save();
            //     }
            // }

    
            let videoPath;
    
            if(resolution){
                const values = {
                    "SD": "720x480",
                    "HD": "1280x720",
                    "FULL HD": "1920x1080",
                }
                const result = video.resolutionFiles.find(x => x.filePath.includes(values[resolution]))
                console.log({result: result});
                if(result){
                    videoPath = path.join(process.cwd() , result.filePath);
                    if (!fs.existsSync(videoPath)) {
                        videoPath = path.join(process.cwd() , video.filePath);
                    }
                }else{
                    videoPath = path.join(process.cwd() , video.filePath);
                }
                

                
            }else{
                videoPath = path.join(process.cwd() , video.filePath);
            }
    
            console.log({ resolution, videoPath });
    
            if (!fs.existsSync(videoPath)) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'Fichier vidéo non trouvé'
                });
            }
    
            const stat = fs.statSync(videoPath);
            const fileSize = stat.size;
    
            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
    
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4'
                });
    
                const videoStream = fs.createReadStream(videoPath, { start, end });
                videoStream.pipe(res);
    
                videoStream.on('error', (err) => {
                    console.error('Erreur lors de la lecture de la vidéo :', err);
                    res.status(500).send('Erreur lors de la lecture de la vidéo.');
                });
            } else {
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4'
                });
    
                const videoStream = fs.createReadStream(videoPath);
                videoStream.pipe(res);
    
                videoStream.on('error', (err) => {
                    console.error('Erreur lors de la lecture de la vidéo :', err);
                    res.status(500).send('Erreur lors de la lecture de la vidéo.');
                });
            }
        } catch (err) {
            console.error('Erreur lors de la lecture de la vidéo :', err);
            res.status(500).send('Erreur lors de la lecture de la vidéo.');
        }
    },
    
   
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.getVideos()
     */
    getVideosByPage: async (req, res) => {
        try {
            console.log({userId: req.userId});
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            pageLimit = pageLimit > 100 ? 100 : pageLimit

            let allCount = await VideoModel.find({ author: req.userId }).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let videos = await VideoModel.find({ author: req.userId })
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            videos = videos.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            videos = await Promise.all(videos.map(async (video) => {

                const item = {}
                item._id = video._doc._id
                item.name = video._doc.name
                item.description = video._doc.description
                item.videoUri = "/video/read/" + video._doc._id
                item.uniqueCode = video._doc.uniqueCode
                item.author = video._doc.author
                item.posterFiles = video._doc.posterFiles
                item.duration = video._doc.duration
                item.updated_at = video._doc.updated_at
                item.created_at = video._doc.created_at
                return item
            }))

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                allCount: allCount,
                resultCount: videos.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: videos.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.getVideos()
     */
    getVideos: async (req, res) => {
        try {
            console.log({ author: req.user });
            let videos = await VideoModel.find({ author: req.userId },
                {
                    name: true,
                    duration: true,
                    description: true,
                    uniqueCode: true,
                    posterFiles: true,
                    updated_at: true,
                    created_at: true
                }).sort('-created_at')

            videos = await Promise.all(videos.map(async (video) => {
                const item = { ...video._doc }
                item.videoUri = "/video/read/" + video._id
                return item
            }))

            return res.json({
                isSuccess: true,
                statusCode: 200,
                resultCount: videos.length,
                results: videos,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.showVideoById()
     */
    searchVideoByTag: async (req, res) => {
        try {

            let filter = { author: req.userId }
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            pageLimit = pageLimit > 100 ? 100 : pageLimit


            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const description = req.query?.description ? new RegExp(req.query.content, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if (!name && !description && !startDate && !endDate) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 500,
                    message: 'Error when searching video.',
                    error: 'Params required !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });

            }
            if (name) {
                filter.name = name
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

            let allCount = await VideoModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let videos = await VideoModel.find(filter, {
                name: true,
                duration: true,
                description: true,
                uniqueCode: true,
                posterFiles: true,
                updated_at: true,
                created_at: true
            })
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            videos = videos.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            videos = await Promise.all(videos.map(async (video) => {
                const item = { ...video._doc }
                item.videoUri = "/video/read/" + video._id
                return item
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
                results: videos.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.showVideoById()
     */
    showVideoByUniqueCode: async (req, res) => {
        try {
            const uniqueCode = req.params.uniqueCode;
            let video = await VideoModel.findOne({ 
                uniqueCode: uniqueCode, 
                author: req.userId },{
                    name: true,
                    duration: true,
                    description: true,
                    uniqueCode: true,
                    posterFiles: true,
                    updated_at: true,
                    created_at: true
                })


            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such video',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            video = {
                ...video._doc,
                videoUri: "/video/read/" + video._id
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: video,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    showVideoById: async (req, res) => {
        try {
            const id = req.params.id;
            let video = await VideoModel.findOne(
                { _id: id, author: req.userId },
                {
                    name: true,
                    duration: true,
                    description: true,
                    uniqueCode: true,
                    posterFiles: true,
                    updated_at: true,
                    created_at: true,
                }
            )


            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such video',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            video = {
                ...video._doc,
                videoUri: "/video/read/" + video._id
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: video,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.showVideoById()
     */
    showVideoBySlug: async (req, res) => {
        try {
            const id = req.params.slug;
            const video = await VideoModel.findOne({ slug: slug })

            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    statusCode: 404,
                    message: 'No such video',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                result: video,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.createVideo()
     */
    createVideo: async (req, res) => {
        try {
            let video;
    
            if (req?.files?.length) {
                video = JSON.parse(req.body.video);
            } else {
                video = req.body.video;
            }
    
            video = typeof video === "string" ? JSON.parse(video) : video;
    
            if (!video) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of video.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
    
            if (!Object.keys(video).length) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty video!',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
    
            const uniqueCode = generateRandomString(15);
    
            if (req?.files?.length) {
                const file = req?.files[0];
                fs.mkdir(process.cwd() + "/src/storage/videos", (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
    
                try {
                    await fs.promises.rename(
                        process.cwd() + `/src/storage/${file.filename}`,
                        process.cwd() + `/src/storage/videos/${uniqueCode}.mp4`
                    );
                    console.log('Successfully renamed - moved!');
                    video.filePath = `/src/storage/videos/${uniqueCode}.mp4`;
                } catch (err) {
                    throw err;
                }
            }
    
            let metadata;
            let posterCount = 4;
            const resolutions = await videoResolutionModel.find({});
    
            try {
                const videoPath = process.cwd() + video.filePath;
                metadata = await getVideosMetadatas(videoPath);
                video.duration = formatDuration(metadata.format.duration);
                video.posterFiles = [];
                video.resolutionFiles = [];
                video.metadata = metadata;
    
                for (let i = 1; i <= posterCount; i++) {
                    const posterFileName = `poster_${i}.jpg`;
                    const posterFilePath = `/assets/images/posters/${uniqueCode + "_" + posterFileName}`;
                    video.posterFiles.push(posterFilePath);
                }
    
                resolutions.forEach((resolution) => {
                    const outputFileName = `${uniqueCode + "_" + resolution.size}.mp4`;
                    const outputFilePath = `./src/storage/videos/${outputFileName}`;
                    let result = {
                        name: resolution.name,
                        size: resolution.size,
                        filePath: outputFilePath
                    };
                    video.resolutionFiles.push(result);
                });
            } catch (error) {
                console.log(error);
            }
    
            console.log({ metadata });
    
            video = new VideoModel({ ...video });
    
            video.created_at = video?.created_at || new Date();
            video.uniqueCode = uniqueCode;
            video.author = req.userId;
    
            await video.save();
    
            return res.status(201).json({
                isSuccess: true,
                statusCode: 201,
                message: "video is saved!",
                result: { 
                    _id: video._id,
                    duration: {
                        durationInt: metadata.format.duration,
                        durationString: video.duration,
                    },
                    uri: "/videos/" + uniqueCode
                },
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
    
        } catch (error) {
            console.log(error);
    
            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when creating video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController. updateVideoById()
     */
    updateVideoById: async (req, res) => {
        try {
            const id = req.params.id;
            let video;
            let deleteFiles = [];
    
            if (req?.files?.length) {
                video = JSON.parse(req.body.video);
                const file = req.files[0];
                const destination = process.cwd() + "/src/storage/videos";
                fs.mkdir(destination, (err) => {
                    if (err) console.error(err);
                });
                try {
                    await fs.promises.rename(
                        process.cwd() + `/src/storage/${file.filename}`,
                        `${destination}/${file.filename}`
                    );
                    console.log('Successfully renamed - moved!');
                    const oldVideo = await VideoModel.findOne({ _id: id });
                    deleteVideoFiles(oldVideo);
                    video.filePath = `/src/storage/videos/${file.filename}`;
                } catch (err) {
                    throw err;
                }
            } else {
                ({ video } = req.body);
            }
    
            video = typeof video === "string" ? JSON.parse(video) : video;
    
            if (!video) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of video.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
    
            if (!Object.keys(video).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty video!',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
    
            try {
                deleteFiles = JSON.parse(req.body?.deleteFiles) || [];
            } catch (error) {
                deleteFiles = [];
            }
    
            let metadata;
            let uniqueCode = video.uniqueCode;
            let posterCount = 4;
            const resolutions = await videoResolutionModel.find({});
    
            try {
                const videoPath = process.cwd() + video.filePath;
                metadata = await getVideosMetadatas(videoPath);
                video.duration = formatDuration(metadata.format.duration);
                video.posterFiles = [];
                video.resolutionFiles = [];
                video.metadata = metadata;
    
                for (let i = 1; i <= posterCount; i++) {
                    const posterFileName = `poster_${i}.jpg`;
                    const posterFilePath = `/assets/images/posters/${uniqueCode + "_" + posterFileName}`;
                    video.posterFiles.push(posterFilePath);
                }
    
                resolutions.forEach((resolution) => {
                    const outputFileName = `${uniqueCode + "_" + resolution.size}.mp4`;
                    const outputFilePath = `./src/storage/videos/${outputFileName}`;
                    let result = {
                        name: resolution.name,
                        size: resolution.size,
                        filePath: outputFilePath
                    };
                    video.resolutionFiles.push(result);
                });
            } catch (error) {
                console.log(error);
            }
    
            if (deleteFiles.length) {
                deleteFiles.forEach(currentFileUrl => {
                    fs.unlink(currentFileUrl, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                });
            }
    
            video.updated_at = video?.updated_at || new Date();
    
            delete video._id;
            await VideoModel.updateOne({ _id: id }, { ...video, status: "Pending" });
    
            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "video is updated!",
                video: {
                    ...video._doc,
                    duration: {
                        durationInt: video.metadata.format.duration,
                        durationString: video.duration,
                    }
                },
                result: {
                    _id: video._id,
                    duration: {
                        durationInt: video.metadata.format.duration,
                        durationString: video.duration,
                    },
                    uri: `/videos/${uniqueCode}`
                },
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
    
        } catch (error) {
            console.log(error);
    
            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    
    updateVideoByUniqueCode: async (req, res) => {
        try {
            const uniqueCode = req.params.uniqueCode;
            let video;
            let deleteFiles = [];
    
            
            if (req?.files?.length) {
                const oldVideo = await VideoModel.findOne({ uniqueCode });
    
                if (!oldVideo) {
                    return res.status(422).json({
                        isSuccess: false,
                        statusCode: 422,
                        message: 'Missing params of video.',
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                video = JSON.parse(req.body.video);
                const file = req.files[0];
                const destination = process.cwd() + "/src/storage/videos";
                fs.mkdir(destination, (err) => {
                    // if (err) console.error(err);
                });
                try {
                    deleteVideoFiles(oldVideo);

                    await fs.promises.rename(
                        path.join(process.cwd(), file.path),
                        path.join(destination, `${uniqueCode}.mp4`) 
                    );
                    console.log('Successfully renamed - moved!');
                    
                    
                    
                    video.filePath = `/src/storage/videos/${uniqueCode}.mp4`;
                } catch (err) {
                    throw err;
                }
            } else {
                ({ video } = req.body);
            }
    
            video = typeof video === "string" ? JSON.parse(video) : video;
    
            if (!video) {
                return res.status(422).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Missing params of video.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
    
            if (!Object.keys(video).length) {
                return res.status(500).json({
                    isSuccess: false,
                    statusCode: 422,
                    message: 'Empty video!',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
    
            try {
                deleteFiles = JSON.parse(req.body?.deleteFiles) || [];
            } catch (error) {
                deleteFiles = [];
            }
    
            let metadata;
            let posterCount = 4;
            const resolutions = await videoResolutionModel.find({});
    
            try {
                const videoPath = process.cwd() + video.filePath;
                metadata = await getVideosMetadatas(videoPath);
                video.duration = formatDuration(metadata.format.duration);
                video.posterFiles = [];
                video.resolutionFiles = [];
                video.metadata = metadata;
    
                for (let i = 1; i <= posterCount; i++) {
                    const posterFileName = `poster_${i}.jpg`;
                    const posterFilePath = `/assets/images/posters/${uniqueCode + "_" + posterFileName}`;
                    video.posterFiles.push(posterFilePath);
                }
    
                resolutions.forEach((resolution) => {
                    const outputFileName = `${uniqueCode + "_" + resolution.size}.mp4`;
                    const outputFilePath = `./src/storage/videos/${outputFileName}`;
                    let result = {
                        name: resolution.name,
                        size: resolution.size,
                        filePath: outputFilePath
                    };
                    video.resolutionFiles.push(result);
                });
                
            } catch (error) {
                console.log(error);
            }
    
            if (deleteFiles.length) {
                deleteFiles.forEach(currentFileUrl => {
                    fs.unlink(currentFileUrl, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                });
            }
    
            video.updated_at = video?.updated_at || new Date();
    
            delete video._id;
            video.status = "Pending"
            await VideoModel.updateOne({ uniqueCode }, { ...video });
    
            return res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: "video is updated!",
                video: {
                    ...video._doc,
                    duration: {
                        durationInt: video.metadata.format.duration,
                        durationString: video.duration,
                    }
                },
                result: {
                    _id: video._id,
                    duration: {
                        durationInt: video.metadata.format.duration,
                        durationString: video.duration,
                    },
                    uri: `/videos/${uniqueCode}`
                },
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
    
        } catch (error) {
            console.log(error);
    
            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when updating video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.sortVideoByPosition
     */
    sortVideoByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await VideoModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                statusCode: 200,
                isSuccess: true,
                message: "video sorted !",
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
     * videoController.removeVideoById()
     */
    removeVideoById: async (req, res) => {
        try {
            var id = req.params.id;
            let video
            if (req.user.roles.includes('ROLE_ADMIN')) {
                // ADMIN
                video = await VideoModel.findOne({ _id: id })
            } else {
                ///
                video = await VideoModel.findOne({_id: id, author: req.userId})
            }
            if (video) {
                deleteVideoFiles(video)
                await VideoModel.deleteOne({ _id: id })
            }

            return res.status(204).json({});

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when deleting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    removeVideoByUnique: async (req, res) => {
        try {
            var uniqueCode = req.params.uniqueCode;
            let video
            if (req.user.roles.includes('ROLE_ADMIN')) {
                // ADMIN
                video = await VideoModel.findOne({ uniqueCode, status: "Completed" })
            } else {
                ///
                video = await VideoModel.findOne({uniqueCode: uniqueCode, author: req.userId, status: "Completed"})
            }
            if (video) {
                deleteVideoFiles(video)
                await VideoModel.deleteOne({ uniqueCode })
            }

            return res.status(204).json({});

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                statusCode: 500,
                message: 'Error when deleting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
