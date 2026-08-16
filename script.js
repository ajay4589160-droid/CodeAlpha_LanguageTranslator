const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");
const swapButton = document.getElementById("swapButton");

const charCount = document.getElementById("charCount");
const statusMessage = document.getElementById("statusMessage");

inputText.addEventListener("input", () => {
    charCount.textContent = inputText.value.length;
});

translateButton.addEventListener("click", async () => {

    const text = inputText.value.trim();
    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    if (!text) {
        statusMessage.textContent = "Please enter some text.";
        return;
    }

    if (source === target) {
        statusMessage.textContent = "Choose different languages.";
        return;
    }

    outputText.textContent = "Translating...";
    statusMessage.textContent = "Connecting to Gemini...";

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                source: source,
                target: target
            })
        });

        const data = await response.json();

        console.log("SERVER RESPONSE:", data);

        if (!response.ok) {
            throw new Error(data.error || "Translation failed");
        }

        outputText.textContent = data.translation;

        statusMessage.textContent =
            "Translation completed successfully!";

    } catch (error) {

        console.error(error);

        outputText.textContent =
            "Unable to translate.";

        statusMessage.textContent =
            error.message;
    }
});

clearButton.addEventListener("click", () => {
    inputText.value = "";
    outputText.textContent =
        "Your translation will appear here...";
    statusMessage.textContent = "";
    charCount.textContent = "0";
});

copyButton.addEventListener("click", async () => {

    const text = outputText.textContent;

    if (
        !text ||
        text === "Your translation will appear here..." ||
        text === "Translating..."
    ) {
        statusMessage.textContent =
            "There is no translation to copy.";
        return;
    }

    await navigator.clipboard.writeText(text);

    statusMessage.textContent =
        "Translation copied!";
});

swapButton.addEventListener("click", () => {

    const oldSource = sourceLanguage.value;
    const oldTarget = targetLanguage.value;

    sourceLanguage.value = oldTarget;
    targetLanguage.value = oldSource;
});