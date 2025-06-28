document.addEventListener("DOMContentLoaded", () => {
  // Light mode is default
  document.getElementById("darkModeToggle").checked = false;

  document.getElementById("darkModeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark");
  });
});

async function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  const chatBox = document.getElementById("chat-box");
  const subject = document.getElementById("subject").value;
  const level = document.getElementById("level").value;

  if (!userInput) return;

  // User message
  const userMessage = document.createElement("div");
  userMessage.className = "chat-message user";
  userMessage.innerHTML = `<div class="chat-bubble">${userInput}</div>`;
  chatBox.appendChild(userMessage);

  // Typing bot message
  const botMessage = document.createElement("div");
  botMessage.className = "chat-message bot";
  botMessage.innerHTML = `<div class="chat-bubble">TutorBot: Typing...</div>`;
  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const messages = [
    {
      role: "system",
      content: `You are a helpful AI tutor for a ${level} level student learning ${subject}. Respond with clear, easy-to-understand bullet points. Avoid long paragraphs.`
    },
    {
      role: "user",
      content: userInput
    }
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`, // Add in config.js
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Smart Tutor Chatbot"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";

    botMessage.innerHTML = `<div class="chat-bubble">TutorBot: ${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error("❌ OpenRouter Error:", error.message);
    botMessage.innerHTML = `<div class="chat-bubble">TutorBot: Oops! Something went wrong.</div>`;
  }

  document.getElementById("user-input").value = "";
}
