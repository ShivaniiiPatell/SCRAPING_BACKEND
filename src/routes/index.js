const express = require('express');
const scraperRouter = require('./scraper.js');

const router = express.Router();

router.use('/scrape', scraperRouter);

module.exports = router;
