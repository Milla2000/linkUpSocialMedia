const { Router } = require('express');
//import the trends controller
const { getTrendingWords } = require('../controllers/trendsController');


const trendingWords = Router()

trendingWords.get("/", getTrendingWords);

module.exports = {
    trendingWords
}