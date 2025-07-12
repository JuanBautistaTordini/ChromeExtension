//content.js
const button = document.createElement("button");
button.textContent = "🤖 Ayuda IA";
button.id = "smarthelp-button";
document.body.appendChild(button);

button.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "openPopup" });
});
