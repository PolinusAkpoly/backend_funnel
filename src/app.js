const express = require('express');
const csurf = require('csurf');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Twig = require('twig');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const createError = require('http-errors');
const session = require('express-session');
const passport = require('passport');
require('../config/passport-config');
const cors = require('cors');


const config = dotenv.config();
dotenvExpand.expand(config);
var configConnection = require('./../config/connection');
const client_authorizedModel = require('./models/client_authorizedModel');
const videoModel = require('./models/videoModel');
const { encodeVideo, updateVideoStatus, loadUsers, loadNavItems, loadClients } = require('./helpers/videoHelpers');
const { logRequestInfo } = require('../config/client');
// console.log(process.env);


const app = express();
app.use(cookieParser());

// Enable cors
app.use(cors());

// Middleware
app.set('twig options', {
  allowAsync: true,
  strict_variables: false,
});

// Activer csurf
// const csrfProtection = csurf({ cookie: true });
// app.use(cookieParser());
// app.use(csrfProtection);

// Exposer le jeton CSRF à votre application frontend
// app.use((req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });
// // Exposer le jeton CSRF à votre application frontend
// app.get('/get-csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());





app.set('views', path.join(process.cwd(), 'src/views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));

// CORS Middleware
app.use(async (req, res, next) => {
  const clients = (await client_authorizedModel.find({})).map((c) => c.link);
  const origin = req.headers.origin || '';
  // const pathname = req.headers.pathname || '';

  // console.log({ url: req.url });
  
  if (process.env.NODE_ENV === 'production') {
    loadClients()
    if (clients.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-Auth-Token, date, content-Type, content-Length, Authorization');
      next();
    } 
    else if (req.url.startsWith("/video") || req.url.startsWith("/oauth")) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-Auth-Token, date, content-Type, content-Length, Authorization');
      next();
    }
    else {
      return res.json({
        error: 'Not authorized!',
      });
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-Auth-Token, date, content-Type, content-Length, Authorization');
    next();
  }
});
app.use(logRequestInfo)

loadNavItems()
loadUsers()

// updateVideoStatus()
// .then(()=>{
//   const maxRamUsage = 40000; // 40 Go en Mo
//   let isTaskInProgress = false;
  
  
  
//   // Planifier la tâche toutes les 1 minute
//   cron.schedule('*/1 * * * *', async () => {
//     try {
//       if (isTaskInProgress) {
//         console.log('La tâche précédente est toujours en cours. Ignorer cette exécution.');
//         return;
//       }
  
//       isTaskInProgress = true;
  
//       const usage = await pidusage(process.pid);
//       const ramUsage = usage.memory / (1024 * 1024); // Convertir en Mo
  
//       let videos = await videoModel
//         .find({ status: 'Priority' })
//         .sort({ created_at: -1 })
//         .limit(1); // Récupère jusqu'à 20 vidéos en attente
        
//       if (!videos.length) {
//         videos = await videoModel
//           .find({ status: { $in: ['Pending', undefined] } })
//           .sort({ created_at: -1 })
//           .limit(1); // Récupère jusqu'à 20 vidéos en attente
//       }
  
      
  
//       let videosProcessed = 0;
  
//       for (const video of videos) {
//         if (ramUsage < maxRamUsage) {
//           // Exécuter le traitement vidéo ici
//           await encodeVideo(video);
//           videosProcessed++;
//         } else {
//           console.log('Mémoire RAM disponible insuffisante. Arrêt du traitement.');
//           break;
//         }
//       }
  
//       console.log(`Traitement effectué sur ${videosProcessed} vidéos.`);
//     } catch (error) {
//       console.error(`Erreur lors de la vérification de l'utilisation de la RAM :`, error);
//     } finally {
//       isTaskInProgress = false;
//     }
//   });

// })





// Routes

app.use('/', require('./routes/homeRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/product', require('./routes/productRoutes'));
app.use('/order', require('./routes/orderRoutes'));
app.use('/orderdetail', require('./routes/orderdetailRoutes'));
app.use('/category', require('./routes/categoryRoutes'));
app.use('/page', require('./routes/pageRoutes'));
app.use('/review', require('./routes/reviewRoutes'));
app.use('/file', require('./routes/fileRoutes'));
app.use('/article', require('./routes/articleRoutes'));
app.use('/contact', require('./routes/contactRoutes'));
app.use('/slide', require('./routes/slideRoutes'));
app.use('/meta', require('./routes/metaRoutes'));
app.use('/megaCollection', require('./routes/megaCollectionRoutes'));
app.use('/collection', require('./routes/collectionRoutes'));
app.use('/faq', require('./routes/faqRoutes'));
app.use('/payment', require('./routes/paymentRoutes'));
app.use('/available_payment', require('./routes/available_paymentRoutes'));
app.use('/address', require('./routes/addressRoutes'));
app.use('/email_template', require('./routes/email_templateRoutes'));
app.use('/email_paramater', require('./routes/email_paramaterRoutes'));
app.use('/website_file', require('./routes/website_fileRoutes'));
app.use('/newsletter', require('./routes/newsletterRoutes'));
app.use('/shop_params', require('./routes/shop_paramsRoutes'));
app.use('/friend_request', require('./routes/friend_requestRoutes'));
app.use('/webhook', require('./routes/webhookRoutes'));
app.use('/message', require('./routes/messageRoutes'));
app.use('/chat', require('./routes/chatRoutes'));
app.use('/profile', require('./routes/profileRoutes'));
app.use('/post', require('./routes/postRoutes'));
app.use('/comment', require('./routes/commentRoutes'));
app.use('/post_feed_back', require('./routes/post_feedbackRoutes'));
app.use('/carrier', require('./routes/carrierRoutes'));
app.use('/client_authorized', require('./routes/client_authorizedRoutes'));
app.use('/movie', require('./routes/videoRoutes'));
app.use('/video', require('./routes/videoRoutes'));
app.use('/videos', require('./routes/lectorRoutes'));
app.use('/channel', require('./routes/channelRoutes'));
app.use('/oauthclient', require('./routes/OAuthClientRoutes'));
app.use('/emailevent', require('./routes/emailEventRoutes'));
app.use('/webinaire', require('./routes/webinaireRoutes'));
app.use('/authstrategy', require('./routes/authStrategyRoutes'));
app.use('/oauth', require('./routes/auth2Routes'));
app.use('/formule', require('./routes/formuleRoutes'));
app.use('/documentation', require('./routes/documentationRoutes'));
app.use('/resolution', require('./routes/videoResolutionRoutes'));
app.use('/client', require('./routes/clientDataRoutes'));
app.use('/tunnel', require('./routes/TunnelRoutes'));
app.use('/tunnelstep', require('./routes/TunnelStepRoutes'));
app.use('/TunnelStepType', require('./routes/TunnelStepTypeRoutes'));
app.use('/service', require('./routes/ServiceRoutes'));
app.use('/navitem', require('./routes/navitemRoutes'));
app.use('/template', require('./routes/TemplateRoutes'));
app.use('/stepsettings', require('./routes/stepsettingsRoutes'));
app.use('/filestorage', require('./routes/filestorageRoutes'));
app.use('/formule', require('./routes/formuleRoutes'));
app.use('/option', require('./routes/OptionRoutes'));
app.use('/avantage', require('./routes/AvantageRoutes'));

// Error Handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});

module.exports = app;
