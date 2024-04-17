const OAuthClientModel = require("../models/OAuthClientModel");
const OAuthTokenModel = require("../models/OAuthTokenModel");
const jwt = require('jsonwebtoken');

module.exports = {
    getToken: async (req, res) => {
        try {

            // verify origin
            const origin = req.headers.origin
            console.log({origin});
            
            if (!origin) {
                return res.status(400).json({ error: 'Origin not found !' });
            }

            const {clientId, clientSecret} = req.body; // Le jeton d'accès révoqué est stocké dans req.user (assumant que c'est où vous stockez le token lors de la validation)

            if (!clientId) {
                return res.status(400).json({ error: 'clientId not found' });
            }
            if (!clientSecret) {
                return res.status(400).json({ error: 'clientSecret not found' });
            }
    
            // Invalidez ou supprimez le jeton de votre base de données
            const client = await OAuthClientModel.findOne({clientId, clientSecret})
                                                 .populate('author');
    
            
            if(!client){
                return res.status(400).json({ error: 'client not found' });
            }

            const originsArray = client.origins.map((c) => c.name);

            console.log({clientOrigins: client.origins});
            console.log({originsArray});

            if(!originsArray.includes(origin)){
                return res.status(400).json({ error: 'Origin not Authorized !' });
            }


            const user = client.author 

            return res.status(200).json({
                    isSuccess: true,
                    userId: user._id,
                    user : {
                        email: user.email,
                        fullName: user.fullName,
                        lastname: user.lastname,
                        firstname: user.firstname,
                        roles: user.roles,
                    },
                    token: jwt.sign(
                        { userId: user._id, email: user.email },
                        process.env.TOKEN_SECRET,
                        { expiresIn: process.env.TOKEN_EXPIRATION }
                    )
                })

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while revoking the token' });
        }
    },
    revokeToken: async (req, res) => {
        try {
            const token = req.user; // Le jeton d'accès révoqué est stocké dans req.user (assumant que c'est où vous stockez le token lors de la validation)
            if (!token) {
                return res.status(400).json({ error: 'Token not found' });
            }
    
            // Invalidez ou supprimez le jeton de votre base de données
            await OAuthTokenModel.findOneAndRemove({ accessToken: token.accessToken });
    
            res.status(200).json({ message: 'Token revoked successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while revoking the token' });
        }
    },
}