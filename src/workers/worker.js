//worker.js
const { workerData, parentPort  } = require('worker_threads');
const fs = require('fs');
const { exec } = require('child_process');

const { videoPath, resolutions, posterCount, videoDuration, uniqueCode } = workerData;

let resolutionsCompleted = 0;
let postersCompleted = 0;

// Générer des résolutions multiples
const generateResolutions = () => {
  resolutions.forEach((resolution) => {
    resolution = resolution._doc;
    const outputFileName = `${uniqueCode}_${resolution.size}.mp4`;
    const outputFilePath = `${process.cwd()}/src/storage/videos/${outputFileName}`;
    const command = `ffmpeg -i ${videoPath} -vf "scale=${resolution.size}" -c:a copy ${outputFilePath}`;

    exec(command, (error) => {
      if (error) {
        console.error(`Erreur lors de la génération de ${resolution.size}: ${error}`);
      } else {
        resolutionsCompleted++;
        console.log(`${resolution.size} généré avec succès !`);
        checkCompletion();
      }
    });
  });
};

// Capturer des posters
const capturePosters = () => {
  for (let i = 1; i <= posterCount; i++) {
    const posterTime = (i * videoDuration) / (posterCount + 1); // Temps de capture des posters
    const posterFileName = `poster_${i}.jpg`;
    const posterFilePath = `${process.cwd()}/public/assets/images/posters/${uniqueCode}_${posterFileName}`;
    const command = `ffmpeg -i ${videoPath} -ss ${posterTime} -vframes 1 ${posterFilePath}`;

    exec(command, (error) => {
      if (error) {
        console.error(`Erreur lors de la capture de ${posterFileName}: ${error}`);
      } else {
        postersCompleted++;
        console.log(`${posterFileName} capturé avec succès !`);
        checkCompletion();
      }
    });
  }
};

// Vérifier si tout est terminé
const checkCompletion = () => {
  if (resolutionsCompleted === resolutions.length && postersCompleted === posterCount) {
    console.log('Toutes les tâches sont terminées !');
    parentPort.postMessage('Tâches terminées');
  }
};

// Appels aux fonctions
generateResolutions();
capturePosters();
