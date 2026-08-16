const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing.");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
    try {
        const { text, source, target } = req.body;

        if (!text || !source || !target) {
            return res.status(400).json({
                error: "Missing translation information."
            });
        }

        if (source === target) {
            return res.json({
                translatedText: text
            });
        }

        const languages = {
            en: "English",
            ta: "Tamil",
            hi: "Hindi",
            te: "Telugu",
            ml: "Malayalam",
            kn: "Kannada",
            fr: "French",
            de: "German",
            es: "Spanish",
            ja: "Japanese",
            ko: "Korean",
            zh: "Chinese"
        };

        const sourceName = languages[source];
        const targetName = languages[target];

        const prompt = `
Translate the following text from ${sourceName} to ${targetName}.

Return ONLY the translation.
Do not explain anything.
Preserve names and numbers.

Text:
${text}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const translatedText = response.text?.trim();

        if (!translatedText) {
            throw new Error("No translation returned.");
        }

        res.json({
            translatedText
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Translation failed."
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Index.html"));
});

app.listen(PORT, () => {
    console.log(`AI Translator running at http://localhost:${PORT}`);
});