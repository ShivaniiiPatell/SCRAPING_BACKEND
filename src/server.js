const express = require("express");
const scraperRouter = require("./routes/index.js");
const cors = require("cors");
const connectDB = require("./config/db.js");

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

const corsOptions = {
  origin: "https://scraping-vue.vercel.app",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.json());
app.use("/api", scraperRouter);
app.get("/", async (req, res) => {
  res.send("WELCOME TO SCRAPING");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
