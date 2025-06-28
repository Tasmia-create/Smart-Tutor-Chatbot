export default async function handler(req, res) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  // 1. Check for valid method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Validate API Key
  if (!OPENROUTER_API_KEY) {
    return res.status(401).json({ error: "API Key is missing" });
  }

  try {
    // 3. Forward the request to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://smart-tutor-chatbot.vercel.app", // ✅ Replace with your live domain if needed
        "X-Title": "Smart Tutor Chatbot"
      },
      body: JSON.stringify(req.body)
    });

    // 4. Handle OpenRouter's response
    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    // 5. Catch errors
    console.error("❌ API Proxy Error:", error.message);
    res.status(500).json({ error: "API Proxy Failed", details: error.message });
  }
}
