async function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  const chatBox = document.getElementById("chat-box");
  const subject = document.getElementById("subject").value;
  const level = document.getElementById("level").value;

  if (!userInput.trim()) return;

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

  // Prepare prompt
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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,  // ✅ Fixed
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",  // ✅ Required for OpenRouter
        "X-Title": "Smart Tutor Chatbot"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",  // ✅ Valid OpenRouter model ID
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);  // ✅ Fixed string interpolation
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content;

    botMessage.textContent = "TutorBot: " + (reply || "Sorry, I couldn't understand that.");
  } catch (error) {
    botMessage.textContent = "TutorBot: Oops! Something went wrong.";
    console.error("❌ OpenRouter Error:", error.message);
  }

  // Clear input
  document.getElementById("user-input").value = "";
}
