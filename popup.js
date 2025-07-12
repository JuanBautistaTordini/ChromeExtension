document.getElementById("askBtn").addEventListener("click", async () => {
    const question = document.getElementById("userInput").value;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            func: () => document.body.innerText
        },
        async (results) => {
            const pageText = results[0].result;

            const prompt = `
  Estoy viendo esta página web. Este es su contenido:
  
  """${pageText.slice(0, 4000)}"""
  
  Ahora respondé a esta pregunta que tengo como si fueras un asistente útil: ${question}
        `;

            const responseDiv = document.getElementById("response");
            responseDiv.textContent = "Cargando respuesta...";

            const geminiKey = "";

            const completion = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                            role: "user"
                        }
                    ]
                })
            });

            const data = await completion.json();
            responseDiv.textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error al generar respuesta.";
        }
    );
});
