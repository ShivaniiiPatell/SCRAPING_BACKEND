const express = require("express");
const {
  scrapeData,
  deleteData,
  getDetailsById,
  getScreenShot,
} = require("../controllers/scraperController");

const router = express.Router();

router.post("/", scrapeData);
router.post("/deleteItems", deleteData);
router.get("/screenshot", getScreenShot);
router.get("/:id", getDetailsById);

module.exports = router;
