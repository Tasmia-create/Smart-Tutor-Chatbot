async function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  const chatBox = document.getElementById("chat-box");
  const subject = document.getElementById("subject").value;
  const level = document.getElementById("level").value;
  const sendButton = document.querySelector(".input-area button");

  if (!userInput) return;

  // Disable input while processing
  sendButton.disabled = true;

  // Show user message
  const userMessage = document.createElement("div");
  userMessage.className = "chat-message user";
  userMessage.textContent = userInput;
  chatBox.appendChild(userMessage);

  // Show typing...
  const botMessage = document.createElement("div");
  botMessage.className = "chat-message bot";
  botMessage.textContent = "TutorBot: Typing...";
  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Build prompt messages
  const messages = [
    {
      role: "system",
      content: `You are an AI tutor helping a ${level} level student understand topics in ${subject}. Be friendly, clear, and educational.`
    },
    {
      role: "user",
      content: userInput
    }
  ];

  try {
    if (typeof OPENROUTER_API_KEY === "undefined" || !OPENROUTER_API_KEY) {
      throw new Error("API key not defined. Please set OPENROUTER_API_KEY in config.js.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost", // Update if hosted
        "X-Title": "Smart Tutor Chatbot"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content;

    botMessage.textContent = "TutorBot: " + (reply || "Sorry, I couldn't understand that.");
  } catch (error) {
    botMessage.textContent = "TutorBot: Oops! Something went wrong.";
    console.error("❌ OpenRouter Error:", error.message);
  }

  document.getElementById("user-input").value = "";
  sendButton.disabled = false;
  chatBox.scrollTop = chatBox.scrollHeight;
}
