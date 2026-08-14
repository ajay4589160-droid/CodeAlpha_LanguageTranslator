const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Language Translator Backend is running!"
  });
});

app.post("/translate", async (req, res) => {
  try {
    const { text, source, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({
        error: "Text and target language are required"
      });
    }

    const url =
      "https://api.mymemory.translated.net/get" +
      `?q=${encodeURIComponent(text)}` +
      `&langpair=${encodeURIComponent(source || "auto")}|${encodeURIComponent(target)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json({
      translatedText: data.responseData.translatedText
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Translation failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});