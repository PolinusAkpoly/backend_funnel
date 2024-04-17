const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const { generateRandomString } = require('./utils');

const UploadFile = (req, modelItem, modelName, Model, fields) => {
    try {
        const keys = Object.keys(req?.files)

        if (keys.length) {
            for (let index = 0; index < keys.length; index++) {
                const params = keys[index];
                
                if (params.endsWith("s")) {
                    console.log("plusieurs fichiers");
                    const files = req?.files[params]
                    modelItem[params] = []
                    for (let index = 0; index < files.length; index++) {
                        const file = files[index];
                        fs.mkdir(process.cwd() + `/public/assets/files/${modelName}`, (err) => {
                            // if (err) console.log(err)
                        })
                        fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/Template/${file.filename}`, function (err) {
                            if (err) console.log(err)
                            console.log('Successfully renamed - moved!')
                        })
                        modelItem[params].push(`${req.protocol}://${req.get('host')}/assets/files/${modelName}/${file.filename}`)

                    }
                } else {
                    const file = req?.files[params][0]
                    fs.mkdir(process.cwd() + `/public/assets/files/${modelName}`, (err) => {
                        if (err) console.log(err)
                    })
                    if(params == 'templateUrl'){
                        console.log({params});
                        const fileUrl = process.cwd() + `/public/assets/files/${file.filename}`
                        console.log(modelItem[params]);
                        if(modelItem["uniquePrefix"]){
                            const oldTemplate = process.cwd()+"/public/templates/"+modelItem["uniquePrefix"]
                            
                            fs.rm(oldTemplate, { recursive: true }, (err) => {
                                if (err) {
                                  console.error(`Erreur lors de la suppression du dossier : ${err.message}`);
                                } else {
                                  console.log(`Dossier supprimé avec succès : ${cheminDossier}`);
                                }
                              });
                        }else{
                            modelItem["uniquePrefix"] = undefined
                        }
                        const  { uniquePrefix,  extractedContents } = extractZipContents(fileUrl, modelItem[params]["uniquePrefix"])

                        modelItem["uniquePrefix"] = uniquePrefix
                    } 
                    fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/${modelName}/${file.filename}`, function (err) {
                        if (err) { console.log(err) }
                        console.log('Successfully renamed - moved!')
                    })
                    modelItem[params] = `${req.protocol}://${req.get('host')}/assets/files/${modelName}/${file.filename}`
                }

                  

            }

        }

        const dirPath = process.cwd() + `/public/assets/files/${modelName}`
        deleteUploadedFile(dirPath, Model, fields)

        return modelItem

    } catch (error) {
        return modelItem
    }
}
const deleteUploadedFile = (templateFolder, Model, fields) => {
    fs.readdir(templateFolder, (err, files) => {
        // console.log({ files });
        if (err) {
            console.error('Erreur lors de la lecture du dossier Template :', err);
            return;
        }

        files.forEach(async (file) => {
            const filePath = path.join(templateFolder, file);

            try {
                if (fields?.length) {
                    const filters = []
                    fields.forEach(field => {
                        filters.push({ [field]: { $regex: file, $options: 'i' } })
                    });
                    const data = await Model.findOne({
                        $or: filters
                    });
                    // console.log({ data });
                    if (!data) {
                        // Le fichier n'est pas lié à imageUrl, vous pouvez le supprimer
                        fs.unlink(filePath, err => {
                            if (err) {
                                console.error('Erreur lors de la suppression du fichier non lié à imageUrl :', err);
                            } else {
                                console.log('Fichier non lié à imageUrl supprimé avec succès :', filePath);
                            }
                        });
                    }

                }

            } catch (error) {
                console.log({ error })
            }


        });

    });
}
const extractZipContents = (zipFilePath, uniquePrefix=null) => {
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();

    if(!uniquePrefix){
        uniquePrefix = generateRandomString(10)
    }

    const template_dir = process.cwd()+"/public/templates/"+uniquePrefix

    zip.extractAllTo(template_dir, true);

    const extractedContents = [];

    zipEntries.forEach((entry) => {
        const entryName = entry.entryName.toLowerCase(); // Convertir en minuscules pour la comparaison
        const fileType = path.extname(entryName).toLowerCase();
        
        if (fileType === '.html') {
            // Extraire le contenu HTML
            const fileContent = entry.getData().toString('utf8');
            const fileName = path.basename(entryName, fileType);

            if (!extractedContents[fileType]) {
                extractedContents[fileType] = {};
            }

            extractedContents.push({
                fileType,
                fileName,
                content:fileContent
            })
        }
        
    });


    return {
        uniquePrefix: uniquePrefix,
        extractedContents
    };
};
const cleanLink = (link) => {
    // Vérifier si l'application est en production
    const isProduction = process.env.NODE_ENV === 'production';

    // Si en production, remplacer http par https
    if (isProduction) {
        return link.replace(/^http:/, 'https:');
    }

    // Sinon, renvoyer le lien tel quel
    return link;
};

module.exports = { UploadFile, deleteUploadedFile, extractZipContents, cleanLink }