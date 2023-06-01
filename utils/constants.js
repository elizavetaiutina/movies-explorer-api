const regExp = /^((http|https):\/\/)(www.)?[a-zA-Z0-9@:%._\\+~#?&\\=-]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._\\+~#?&\\=]*)((\/[a-zA-Z0-9@:%._\\+~#?&\\=-]{2,256})*)?/;

require('dotenv').config();

const { PORT = 3000, NODE_ENV, JWT_SECRET } = process.env;

module.exports = {
  regExp,
  PORT,
  NODE_ENV,
  JWT_SECRET,
};
