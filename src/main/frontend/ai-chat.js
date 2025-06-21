const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let conversationFinished = false;

function appendMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchNextAIQuestion(userResponse = null) {
  try {
    const response = await fetch("http://your-backend-endpoint/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userResponse }),
    });

    const result = await response.json();

    if (result.status === "done") {
      appendMessage("✅ AI preference analysis complete!", "ai");
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2500);
    } else {
      appendMessage(result.message, "ai");
    }
  } catch (err) {
    appendMessage("Error contacting AI server.", "ai");
    console.error(err);
  }
}

sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (!text || conversationFinished) return;

  appendMessage(text, "user");
  userInput.value = "";
  fetchNextAIQuestion(text);
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Start the conversation
fetchNextAIQuestion();
