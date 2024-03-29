require('dotenv').config();

const {
  PORT = 3000, NODE_ENV, JWT_SECRET, URL_MONGODB_PRODUCTION,
} = process.env;

const regExp = /^((http|https):\/\/)(www.)?[a-zA-Z0-9@:%._\\+~#?&\\=-]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._\\+~#?&\\=]*)((\/[a-zA-Z0-9@:%._\\+~#?&\\=-]{2,256})*)?/;

const urlMongodb = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const allowedCors = [
  'https://elizavetaiutina.nomoredomains.rocks',
  'http://elizavetaiutina.nomoredomains.rocks',
  'https://api.elizavetaiutina.nomoredomains.rocks',
  'http://api.elizavetaiutina.nomoredomains.rocks',
  'localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3000',
];

module.exports = {
  regExp,
  PORT,
  NODE_ENV,
  JWT_SECRET,
  URL_MONGODB_PRODUCTION,
  urlMongodb,
  allowedCors,
};
