document.addEventListener("DOMContentLoaded", () => {

    const inputText = document.getElementById("inputText");
    const sourceLanguage = document.getElementById("sourceLanguage");
    const targetLanguage = document.getElementById("targetLanguage");
    const translateBtn = document.getElementById("translateBtn");
    const resultText = document.getElementById("resultText");
    const copyBtn = document.getElementById("copyBtn");
    const speakBtn = document.getElementById("speakBtn");
    const swapBtn = document.getElementById("swapBtn");

    // Translate
    translateBtn.addEventListener("click", async () => {

        const text = inputText.value.trim();

        if (!text) {
            resultText.textContent = "Please enter some text.";
            return;
        }

        if (sourceLanguage.value === targetLanguage.value) {
            resultText.textContent = text;
            return;
        }

        resultText.textContent = "Translating... ⏳";

        try {
            const url =
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage.value}|${targetLanguage.value}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.responseData) {
                resultText.textContent =
                    data.responseData.translatedText;
            } else {
                resultText.textContent = "Translation failed.";
            }

        } catch (error) {
            resultText.textContent =
                "Unable to translate. Check your internet connection.";
            console.error(error);
        }
    });

    // Copy
    copyBtn.addEventListener("click", async () => {

        const text = resultText.textContent;

        try {
            await navigator.clipboard.writeText(text);
            copyBtn.textContent = "✅ Copied!";

            setTimeout(() => {
                copyBtn.textContent = "📋 Copy";
            }, 1500);

        } catch (error) {
            alert("Copy failed.");
        }
    });

    // Speak
    speakBtn.addEventListener("click", () => {

        const text = resultText.textContent;

        if (!text) return;

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = targetLanguage.value;

        window.speechSynthesis.speak(speech);
    });

    // Swap
    swapBtn.addEventListener("click", () => {

        const oldSource = sourceLanguage.value;

        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = oldSource;

        const oldText = inputText.value;

        inputText.value = resultText.textContent;
        resultText.textContent = oldText;
    });

});