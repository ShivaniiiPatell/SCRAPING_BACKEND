const {
  scrapeDetails,
  captureHomePageScreenshot,
} = require("../services/scraper.js");
const Details = require("../models/details.js");

exports.scrapeData = async (req, res) => {
  const { url } = req.body;
  try {
    if (url) {
      const details = await scrapeDetails(url);
      details.url = url;
      console.log("details------------", details);
      const detailsDocument = new Details(details);
      await detailsDocument.save();
    }
    const allDetails = await Details.find();
    res.status(201).json(allDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteData = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "Invalid request format. Expected an array of IDs." });
    }
    await Details.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDetailsById = async (req, res) => {
  const { id } = req.params;
  try {
    const details = await Details.findById(id);
    if (!details) {
      return res.status(404).json({ message: "Details not found" });
    }
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScreenShot = async (req, res) => {
  const { url } = req.query;
  try {
    const screenshot = await captureHomePageScreenshot(url);
    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).send("Error capturing screenshot");
  }
};
