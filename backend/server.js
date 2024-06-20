const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);

  try {
    const image = fs.readFileSync(filePath);
    const base64Image = Buffer.from(image).toString("base64");
    const response = await axios.post("<WEB_APP_URL>/api/recognize", {
      image: base64Image,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
