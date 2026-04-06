// server.js
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const jsonbinaccesskey = process.env.JSONBIN_ACCESS_KEY || "69d13eee36566621a87bf035 ";
const jsonbinmasterkey = process.env.JSONBIN_MASTER_KEY || "$2a$10$oC2hITt.J6Hua7Zyv8n2/.COKA0TXaqjX/ejTDYjbVEbAGEZXxUm.";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/connectjson", async function(req, res) {
  try {
    const binid = req.body.binid;

    if (!binid) {
      return res.status(400).json({
        ok: false,
        message: "Missing bin id"
      });
    }

    if (!jsonbinaccesskey && !jsonbinmasterkey) {
      return res.status(500).json({
        ok: false,
        message: "Server key is missing"
      });
    }

    const headers = {
      "Content-Type": "application/json"
    };

    if (jsonbinaccesskey) {
      headers["X-Access-Key"] = jsonbinaccesskey;
    }

    if (jsonbinmasterkey) {
      headers["X-Master-Key"] = jsonbinmasterkey;
    }

    const response = await fetch("https://api.jsonbin.io/v3/b/" + binid + "/latest", {
      method: "GET",
      headers: headers
    });

    const data = await response.json().catch(async function() {
      const text = await response.text();
      return { raw: text };
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        message: data.message || "Json connection failed",
        data: data
      });
    }

    return res.json({
      ok: true,
      message: "Connected successfully",
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error while connecting"
    });
  }
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, function() {
  console.log("Server running on http://localhost:" + port);
});
