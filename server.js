const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Serve Frontend
// ===============================

// IMPORTANT:
// Do NOT use /public here.
// Your index.html is in the repository root.

app.use(express.static(__dirname));


// ===============================
// Gemini API
// ===============================

const apiKey = process.env.GEMINI_API_KEY;

let ai = null;

if (apiKey) {
    ai = new GoogleGenAI({
        apiKey: apiKey
    });

    console.log("Gemini API configured successfully.");
} else {
    console.error("WARNING: GEMINI_API_KEY is not configured.");
}


// ===============================
// Home Page
// ===============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// ===============================
// Translation API
// ===============================

app.post("/translate", async (req, res) => {

    try {

        const {
            text,
            source,
            target
        } = req.body;


        // Check input

        if (!text || !source || !target) {

            return res.status(400).json({

                error: "Missing translation data"

            });

        }


        // Check Gemini API

        if (!ai) {

            return res.status(500).json({

                error:
                    "Gemini API key is not configured on the server."

            });

        }


        // Translation prompt

        const prompt = `
Translate the following text from ${source} to ${target}.

Important rules:

1. Return ONLY the translated text.
2. Do not explain the translation.
3. Do not add quotation marks.
4. Preserve names, numbers, emojis and punctuation when appropriate.
5. Keep the original meaning.
6. If the text is already in the target language, return it naturally.

Text:
${text}
`;


        // Call Gemini

        const response =
            await ai.models.generateContent({

                model: "gemini-3.6-flash",

                contents: prompt

            });


        // Get result

        const translation =
            response.text?.trim();


        // Check result

        if (!translation) {

            return res.status(500).json({

                error:
                    "Gemini did not return a translation."

            });

        }


        // Send result

        res.json({

            translation: translation

        });


    } catch (error) {

        console.error(
            "Gemini translation error:",
            error
        );


        res.status(500).json({

            error:
                "Gemini translation failed."

        });

    }

});


// ===============================
// Render Port
// ===============================

// Render provides the PORT environment variable.
// Locally it will use 3000.

const PORT =
    process.env.PORT || 3000;


// ===============================
// Start Server
// ===============================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Gemini Translator running on port ${PORT}`
        );

    }
);