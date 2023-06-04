const regExp = /^((http|https):\/\/)(www.)?[a-zA-Z0-9@:%._\\+~#?&\\=-]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._\\+~#?&\\=]*)((\/[a-zA-Z0-9@:%._\\+~#?&\\=-]{2,256})*)?/;

const urlDB = 'mongodb://127.0.0.1:27017/bitfilmsdb';

require('dotenv').config();

const { PORT = 3000, NODE_ENV, JWT_SECRET } = process.env;

module.exports = {
  regExp,
  PORT,
  NODE_ENV,
  JWT_SECRET,
  urlDB,
};
