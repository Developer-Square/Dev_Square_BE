require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET_PRODUCTION,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD_PRODUCTION,
  SMTP_USERNAME: process.env.SMTP_PASSWORD_PRODUCTION,
  MONGODB_ATLAS_URL: `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASSWORD}@main-db.pzbof.mongodb.net/devSquareBE?retryWrites=true&w=majority`,
};
