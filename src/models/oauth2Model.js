const OAuth2Server = require('oauth2-server');
const userModel = require('./userModel')

// Configuration MongoDB (assurez-vous que MongoDB est en cours d'exécution)
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oauth2_server');

// Modèle OAuth2 pour Mongoose
const clientSchema = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  grants: [String],
  redirectUris: [String],
});

const accessTokenSchema = new mongoose.Schema({
  accessToken: String,
  accessTokenExpiresAt: Date,
  client: Object,
  clientId: String,
  user: Object,
  userId: String,
});

const refreshTokenSchema = new mongoose.Schema({
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  client: Object,
  clientId: String,
  user: Object,
  userId: String,
});

const ClientModel = mongoose.model('Client', clientSchema);
const AccessTokenModel = mongoose.model('AccessToken', accessTokenSchema);
const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);

const oauth2Model = new OAuth2Server({
  ClientModel,
  userModel,
  AccessTokenModel,
  RefreshTokenModel,
});

module.exports = oauth2Model;
