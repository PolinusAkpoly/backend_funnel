/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:19:59
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TunnelSchema = new Schema({
  name: String,
  slug: String,
  description: String,
  domaine: String,
  steps: [{
    type: Schema.Types.ObjectId,
    ref: 'TunnelStep'
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['audience', 'sell', 'custom', 'webinar'],
  },
  isActive: { type: Boolean, default: false},
  position: Number,
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  created_formatted_with_time_since: String,
  updated_formatted_with_time_since: String
});

// Créer un modèle basé sur le schéma
const TunnelModel = mongoose.model('Tunnel', TunnelSchema);

module.exports = TunnelModel;
