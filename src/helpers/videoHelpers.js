const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const videoModel = require('../models/videoModel');
const videoResolutionModel = require('../models/videoResolutionModel');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const userModel = require('../models/userModel');
const { faker } = require('@faker-js/faker');
const navitemModel = require('../models/navitemModel');
const client_authorizedModel = require('../models/client_authorizedModel');

const formatDuration = (durationInSeconds) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }

}

const getVideosMetadatas = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error('Erreur lors de la récupération de la durée de la vidéo :', err);
        reject(err)
      } else {
        const durationInSeconds = metadata.format.duration;
        console.log('Durée de la vidéo (en secondes) :', durationInSeconds);
        const durationFormatted = formatDuration(durationInSeconds);
        console.log('Durée de la vidéo (formatée) :', durationFormatted);
        resolve(metadata)
      }
    });

  })
}
const deleteVideoFiles = (video) => {
  if (video) {
    video?.resolutionFiles.forEach(resolution => {
      console.log({ resolution });
      const newPath = path.join(process.cwd(), resolution.filePath)
      fs.unlink(newPath, (err) => { })
    });
    video?.posterFiles.forEach(posterUrl => {
      const newPath = path.join(process.cwd(), "public", posterUrl)
      fs.unlink(newPath, (err) => { if (err) console.log(err) })
    });

    const newPath = path.join(process.cwd(), video.filePath)
    fs.unlink(newPath, (err) => { })

  }
}
const deleteVideoResolutionFiles = (video) => {
  if (video) {
    video?.resolutionFiles.forEach(resolution => {
      console.log({ resolution });
      if(video.filePath !== resolution.filePath){
        const newPath = path.join(process.cwd(), resolution.filePath)
        fs.unlink(newPath, (err) => { })
      }
    });
    video?.posterFiles.forEach(posterUrl => {
      const newPath = path.join(process.cwd(), "public", posterUrl)
      fs.unlink(newPath, (err) => {  })
    });

  }
}
const encodeVideo = async (video) => {
  try {
    await videoModel.updateOne({ _id: video._id }, { $set: { status: "In Progress" } });

    const videoPath = path.join(process.cwd(), video.filePath);

    if (!fs.existsSync(videoPath)) {
      await videoModel.updateOne({ _id: video._id }, { $set: { status: "FileNotFound" } });
      console.error('Error file not found:', videoPath);
      return;
    }

    if (!video.metadata) {
      const metadata = await getVideosMetadatas(videoPath);
      const duration = formatDuration(metadata.format.duration);

      video.metadata = metadata;

      await videoModel.updateOne({ _id: video._id }, {
        $set: {
          metadata: metadata,
          duration: duration
        }
      });
    }

    const durationInSeconds = video.metadata.format.duration;
    video.duration = formatDuration(durationInSeconds);

    const resolutions = await videoResolutionModel.find({});
    deleteVideoResolutionFiles(video);
    const posterCount = 4;

    video.posterFiles = [];
    video.resolutionFiles = [];

    const uniqueCode = video.uniqueCode;

    for (let i = 1; i <= posterCount; i++) {
      const posterFileName = `poster_${i}.jpg`;
      const posterFilePath = `/assets/images/posters/${uniqueCode}_${posterFileName}`;
      video.posterFiles.push(posterFilePath);
    }

    resolutions.forEach((resolution) => {
      const outputFileName = `${uniqueCode}_${resolution.size}.mp4`;
      const outputFilePath = `./src/storage/videos/${outputFileName}`;
      video.resolutionFiles.push({
        name: resolution.name,
        size: resolution.size,
        filePath: outputFilePath,
      });
    });

    const videoDuration = video.metadata.format.duration;

    const workerFile = process.cwd() + "/src/workers/worker.js";

    const worker = new Worker(workerFile, {
      workerData: { videoPath, resolutions, posterCount, videoDuration, uniqueCode },
    });

    await new Promise((resolve, reject) => {
      worker.on('message', async () => {
        try {
          const videoPath = path.join(process.cwd(), video.filePath);
          await videoModel.updateOne({ _id: video._id }, {
            $set: {
              filePath: video.resolutionFiles[video.resolutionFiles.length - 1].filePath,
              status: "Completed",
              posterFiles: video.posterFiles,
              resolutionFiles: video.resolutionFiles,
            },
          });

          fs.unlink(videoPath, (err) => { if (err) console.log(err); });

          console.log('Traitement vidéo terminé !');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

  } catch (error) {
    await videoModel.updateOne({ _id: video._id }, { $set: { status: "Error" } });
    console.error('Error during video encoding:', error);
  }
};
const checkVideo = (nomFichier) => {
  return new Promise((resolve, reject) => {
    const commande = `ffmpeg -v error -i ${nomFichier} -f null -`;
    exec(commande, (erreur, stdout, stderr) => {
      if (erreur) {
        reject(`Erreur lors de la vérification de la vidéo : ${erreur}`);
      } else if (stderr) {
        reject(`Erreur lors de la vérification de la vidéo : ${stderr}`);
      } else {
        resolve('La vidéo est correcte, aucun problème détecté.');
      }
    });
  });
}

const updateVideoStatus = async () => {
  return await videoModel.updateMany({ status: "In Progress" },{
    $set: {status : "Pending"}
  });
};

const loadUsers = async () => {
  try {
    const userCount = await userModel.countDocuments();
    await userModel.updateOne({email: 'poakpoli@gmail.com'},{
      $set:{
        roles:["ROLE_USER","ROLE_ADMIN"]
      }
    });
    
    if (userCount < 10 ) {
      for (let index = 0; index < 400; index++) {
        const user = new userModel({
          firstname: faker.internet.userName(),
          lastname: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          // civility: faker.random.arrayElement(['Mr.', 'Mrs.', 'Miss']),
        });

        try {
          await user.save();
        } catch (error) {
          console.error('Error while saving user:', error.message);
        }
      }
    } else {
      console.log('Users already exist. Skipping user creation.');
    }
  } catch (error) {
    console.error('Error while counting users:', error.message);
  }
};
const loadNavItems = async () => {
  try {
    // await navitemModel.deleteMany({})
    const navitemCount = await navitemModel.countDocuments();
    
    if (navitemCount == 0 ) {
      const datas = [
        {
          name: "Home",
          key: "home",
          path: ""
        },
        {
          name: "Users",
          key: "user",
          path: "/user"
        },
        {
          name: "Services",
          key: "service",
          path: "/service"
        },
        {
          name: "Tunnels",
          key: "tunnel",
          path: "/tunnel"
        },
        {
          name: "Step",
          key: "tunnel-step",
          path: "/tunnel-step"
        },
        {
          name: "Step Type",
          key: "TunnelStepType",
          path: "/TunnelStepType"
        },
        {
          name: "Sliders",
          key: "slide",
          path: "/slide"
        },
        {
          name: "Pages",
          key: "page",
          path: "/page"
        },
        {
          name: "Settings",
          key: "shop_params",
          path: "/shop_params"
        },
        {
          name: "Email Params",
          key: "email_paramater",
          path: "/email_paramater"
        },
        {
          name: "Email Template",
          key: "email_template",
          path: "/email_template"
        },
        {
          name: "Client Web",
          key: "client",
          path: "/client"
        },
        {
          name: "Website File",
          key: "website_file",
          path: "/website_file"
        },
        {
          name: "Oauth Client",
          key: "oauthclient",
          path: "/oauthclient"
        },
        {
          name: "Client Authorized",
          key: "client_authorized",
          path: "/client_authorized"
        },
        {
          name: "Nav Items",
          key: "navitem",
          path: "/navitem"
        },
      ]
      for (let index = 0; index < datas.length; index++) {
        const navitem = new navitemModel(datas[index]);

        try {
          console.log({navitem});
          await navitem.save();
        } catch (error) {
          console.error('Error while saving navitem:', error.message);
        }
      }
    } else {
      console.log('navitems already exist. Skipping user creation.');
    }
  } catch (error) {
    console.error('Error while counting navitem:', error.message);
  }
};
const loadClients = async () => {
  try {
    // await navitemModel.deleteMany({})
    const clientCount = await client_authorizedModel.countDocuments();
    
    if (clientCount < 2 ) {
      const datas = [
        {
          name: "Mudey",
          link: "https://funnel.mudey.fr",
        },
        {
          name: "Mudey",
          link: "https://www.funnel.mudey.fr",
        },
      ]
      for (let index = 0; index < datas.length; index++) {
        const client = new client_authorizedModel(datas[index]);

        try {
          console.log({client});
          await client.save();
        } catch (error) {
          console.error('Error while saving client:', error.message);
        }
      }
    } else {
      console.log('client already exist. Skipping user creation.');
    }
  } catch (error) {
    console.error('Error while counting client:', error.message);
  }
};



module.exports = { getVideosMetadatas,loadClients,loadUsers,loadNavItems, updateVideoStatus, checkVideo, formatDuration, deleteVideoFiles, encodeVideo }