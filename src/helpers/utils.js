const friend_requestModel = require("../models/friend_requestModel");
const profileModel = require("../models/profileModel");
const userModel = require("../models/userModel");
const fs = require('fs');
const path = require('path');

const slugify = (str) => {

  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

}
const isValidMongoId = (id) => {
  if (typeof id === 'string' && id.length === 24) {
    // Utilisez une expression régulière pour vérifier si l'ID est composé de caractères hexadécimaux
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
  return false;
}
const generateRandomCode = (length) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    code += digit;
  }
  return code;
}
const getCookie = (name)=>{
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
}


const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const specialCharacters = '-_~';

  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    randomString += randomChar;
  }

  // Insérer les caractères spéciaux
  for (const char of specialCharacters) {
    const randomPosition = Math.floor(Math.random() * randomString.length);
    randomString =
      randomString.slice(0, randomPosition) + char + randomString.slice(randomPosition);
  }

  return randomString;
}

const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};
const updateFriend = async (userId) => {
  const friends = await friend_requestModel.find({
    $or: [
      { ownerId: userId },
      { senderId: userId }
    ],
    status: "ACCEPT"
  })
  await userModel.updateOne({ _id: userId }, {
    friend_count: friends.length
  })
  await profileModel.updateOne({ user: userId }, {
    friend_count: friends.length
  })
};
const getFriendsId = async (userId) => {
  const friends = await friend_requestModel.find({
    $or: [
      { ownerId: userId },
      { senderId: userId }
    ],
    status: "ACCEPT"
  })

  const usersId = []

  friends.forEach((friend) => {
    if (friend.ownerId !== userId) {
      usersId.push(friend.ownerId)
    }
    if (friend.senderId !== userId) {
      usersId.push(friend.senderId)
    }
  })
  return usersId
};

const generateApiKey = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let apiKey = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters.charAt(randomIndex);
  }

  return apiKey;
}
const accessAdmin = async (req, res, next) => {
 
  next()
}
const importRoutes = (directory) => {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);
    const route = require(filePath);

    // Vous pouvez ajuster le chemin de la route en fonction du nom du fichier, par exemple :
    // const routePath = `/${file.replace('.js', '')}`;

    // Utilisation de la route dans l'application Express
    app.use('/', route);

    console.log(`Route ${file} importée.`);
  });
};



module.exports = { slugify,getCookie, isValidMongoId, uniqueId, generateApiKey, generateRandomCode, generateRandomString, updateFriend, getFriendsId, accessAdmin, importRoutes }