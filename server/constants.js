require('dotenv').config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    PORT,
    JWT_SECRET
}