require('dotenv').config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY;
const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const MASTER_KEY = process.env.MASTER_KEY;

module.exports = {
    PORT,
    JWT_SECRET,
    MONGODB_URI,
    PINATA_GATEWAY,
    PINATA_JWT,
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    MASTER_KEY
}