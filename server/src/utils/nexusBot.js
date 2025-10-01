const { GoogleGenerativeAI } = require('@google/generative-ai');
const {GEMINI_KEY} = require('../../constants');

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
});

module.exports = {model};