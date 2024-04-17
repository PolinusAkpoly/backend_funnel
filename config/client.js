const useragent = require('express-useragent');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const axios = require('axios');
const clientDataModel = require('../src/models/clientDataModel');

const logRequestInfo = async (req, res, next) => {
    try {
        // Récupération de l'adresse IP du client
        const clientIp = requestIp.getClientIp(req);

        // Récupération des informations sur l'agent utilisateur
        const userAgent = useragent.parse(req.headers['user-agent']);

        // Récupération de la langue préférée de l'utilisateur depuis l'en-tête 'accept-language'
        const acceptLanguage = req.headers['accept-language'];

        // Utilisation de geoip-lite pour obtenir le pays, la ville et les coordonnées à partir de l'adresse IP
        const geo = geoip.lookup(clientIp);

        // Extraire des informations spécifiques
        const browser = userAgent.browser;
        const os = userAgent.os;
        const device = userAgent.device;

        // Récupération des données de géolocalisation
        let country = 'Unknown';
        let city = 'Unknown';
        let latitude = 'Unknown';
        let longitude = 'Unknown';
        let origin = req.headers.origin || req.headers.referer || 'Unknown';

        if (geo) {
            country = geo.country || 'Unknown';
            city = geo.city || 'Unknown';
            latitude = geo.ll[0] || 'Unknown';
            longitude = geo.ll[1] || 'Unknown';
        }

        const client = new clientDataModel({
            clientIp,
            browser,
            os,
            device,
            acceptLanguage,
            country,
            city,
            latitude,
            longitude,
            origin,
        });

        const isExist = await clientDataModel.findOne({ clientIp , origin});

        if (!isExist) {
            await client.save();
        }
    } catch (error) {
        console.error(error);
    }

    // Passez à la prochaine étape du middleware
    next();
};


module.exports = {logRequestInfo}
