const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

// Frontend
app.use(express.static("/public"));

app.get("/", (req, res) => {
    res.sendFile("/public/index.html");
});

// Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/translate", async (req, res) => {
    try {
        const { text, source, target } = req.body;

        if (!text || !source || !target) {
            return res.status(400).json({
                error: "Missing translation data"
            });
        }

        const languageNames = {
            en: "English",
            ta: "Tamil",
            te: "Telugu",
            hi: "Hindi",
            ml: "Malayalam",
            kn: "Kannada",
            fr: "French",
            de: "German",
            es: "Spanish"
        };

        const sourceName = languageNames[source] || source;
        const targetName = languageNames[target] || target;

        const prompt = `Translate the following text.

Source language: ${sourceName}
Target language: ${targetName}

Return ONLY the translation.
Do not explain.
Do not answer the text.
Do not add quotation marks.

Text:
${text}`;

        // Use a model available to your API key.
        // We will verify the model if this one is unavailable.
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const translation = response.text?.trim();

        if (!translation) {
            throw new Error("Gemini returned an empty response");
        }

        console.log("Translation:", translation);

        res.json({
            translation: translation
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: "Gemini translation failed"
        });
    }
});

app.listen(3000, () => {
    console.log("Gemini Translator running on port 3000");
});