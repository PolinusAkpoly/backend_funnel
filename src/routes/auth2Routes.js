const express = require('express');
const bcrypt = require('bcrypt');
const auth2Controller = require('../controllers/auth2Controller');
const passport = require('passport');
const oauth2orize = require('oauth2orize');
const crypto = require('crypto'); // Ajout de la bibliothèque crypto
const OAuthTokenModel = require('../models/OAuthTokenModel');
const userModel = require('../models/userModel');
const applicationModel = require('../models/applicationModel');
const OAuthClientModel = require('../models/OAuthClientModel');
const server = oauth2orize.createServer();
const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/auth/google/callback', passport.authenticate('google',
//     {
//         successRedirect: '/',
//         failureRedirect: '/login'
//     }));
router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err || !user) {
            return res.redirect('/login'); // Redirection en cas d'erreur ou d'échec d'authentification
        }

        console.log({
            user
        });

        // Générez un jeton d'authentification JWT
        const token = jwt.sign(
            { _id: user._id, userId: user._id, email: user.email },
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRATION }
        )
        // Envoyez le jeton au client
        res.cookie('jwt', token); // Vous pouvez également l'envoyer dans une réponse JSON

        console.log(req.headers);
        const params = `token=${token}`
        if (process.env.NODE_ENV === "production") {
            return res.redirect(`https://ouitube.fr/auth/success?${params}`);
        } else {
            return res.redirect(`http://localhost:3000/auth/success?${params}`);
        }
        // Redirigez le client vers la page d'accueil ou toute autre page appropriée
    })(req, res, next);
});

// Définissez une stratégie pour la demande de jeton OAuth 2.0
server.exchange(oauth2orize.exchange.password(async (client, email, password, scope, done) => {
    try {
        // Exemple : valider le client OAuth2.0
        if (!client.grants.includes('client_credentials')) { // Utilisez includes pour vérifier la présence de 'password'
            console.log({ client });
            return done(null, false);
        }

        // Exemple : vérifier les informations d'identification de l'utilisateur
        const user = await userModel.findOne({ email: email });

        if (!user) {
            console.log({ user });
            return done(null, false);
        }

        const isSamePassword = await bcrypt.compare(password, user.password);

        if (!isSamePassword) {
            console.log({ isSamePassword });
            return done(null, false);
        }

        // Générez un jeton d'accès
        const tokenValue = crypto.randomBytes(32).toString('hex');

        // Créez un nouvel objet de jeton
        const token = new OAuthTokenModel({
            accessToken: tokenValue,
            clientId: client.clientId,
            userId: user._id,
            scope: scope,
        });

        // Sauvegardez le jeton dans votre base de données
        await token.save();

        return done(null, tokenValue);
    } catch (err) {
        console.log({ err });
        return done(err);
    }
}));

// Créez une route pour la demande de jeton
// router.get('/token', auth2Controller.getToken);

router.post('/token', auth2Controller.getToken);

router.post('/revoke', passport.authenticate('bearer', { session: false }), auth2Controller.revokeToken);

router.get('/authorize', async (req, res, next) => {
    const clientId = req.query.client_id;
    const client = await OAuthClientModel.findOne({ clientId }); // Utilisez await pour attendre la promesse

    if (!client) {
        return res.status(400).json({
            isSuccess: false,
            statusCode: 400,
            error: 'Invalid client_id'
        });
    }

    // Générez la page d'autorisation OAuth 2.0
    return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        authorize: {
            client,
        }
    });
});

// Créez une route pour gérer la réponse de l'utilisateur à l'autorisation
router.post('/authorize/client', (req, res, next) => {
    // Vérifiez si l'utilisateur a approuvé ou refusé l'autorisation
    const isApproved = req.body.approve === 'yes';

    if (isApproved) {
        // Si l'utilisateur approuve, redirigez vers l'URL de redirection du client avec le code d'autorisation
        const redirectUri = req.body.redirect_uri;
        const code = 'your_authorization_code'; // Générez le code d'autorisation

        return res.json({
            isSuccess: true,
            redirectUri: `${redirectUri}?code=${code}`
        });

    } else {
        // Si l'utilisateur refuse, redirigez avec un message d'erreur
        return res.json({
            isSuccess: false,
            redirect_uri: `${req.body.redirect_uri}?error=access_denied`
        });
    }
});
router.post('/access_token', (req, res, next) => {
    // Utilisez oauth2orize pour gérer l'échange du code d'autorisation contre un jeton
    server.token()(req, res, next);
}, (req, res) => {
    // La réponse de server.token() contient le jeton d'accès
    if (req.oauth2.accessToken) {
        return res.json({
            access_token: req.oauth2.accessToken,
            token_type: 'bearer',
        });
    } else {
        return res.status(400).json({ error: 'Invalid token' });
    }
});

module.exports = router;