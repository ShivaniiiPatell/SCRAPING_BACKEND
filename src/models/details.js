const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema({
  url: String,
  name: String,
  description: String,
  companyLogo: String,
  facebookURL: String,
  linkedinURL: String,
  twitterURL: String,
  instagramURL: String,
  address: String,
  phoneNumber: String,
  email: String,
});

module.exports = mongoose.model("Details", detailsSchema);
