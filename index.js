require("dotenv").config();
const dns = require("dns");
const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const app = express();
const reset = "\x1b[0m";
const blue = "\x1b[34m";

let urlCounter = 1;

const urlMappings = new Map();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  dns.lookup(new URL(req.body.url).hostname, (err, address) => {
    if (err) {
      console.error("Error:", err);
      res.json({ error: "invalid url" });
    } else {
      console.log("Resolved IP address:", address);
      const shortUrl = urlCounter++;
      urlMappings.set(shortUrl, req.body.url);
      res.json({ original_url: req.body.url, short_url: shortUrl });
    }
  });
});

app.get("/api/shorturl/:number", function (req, res) {
  const shortUrl = parseInt(req.params.number);
  if (urlMappings.has(shortUrl)) {
    const originalUrl = urlMappings.get(shortUrl);
    res.redirect(originalUrl);
  } else {
    // Short URL not found
    res.status(404).send("Short URL not found");
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Your app is listening on port " +
      blue +
      "http://localhost:" +
      listener.address().port +
      "/" +
      reset
  );
});
