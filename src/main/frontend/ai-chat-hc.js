// ai-chat.js

const questions = [
  "What qualities do you value most in a romantic partner?",
  "Describe a moment in your life when you felt truly connected to someone.",
  "What does emotional intimacy mean to you?",
  "If you could change one thing about your past relationships, what would it be and why?",
  "What's your biggest fear when it comes to love?",
  "How do you usually express love and affection?",
  "Do you believe in soulmates? Why or why not?",
  "What role does vulnerability play in your relationships?",
  "How do you handle conflict in a relationship?",
  "What's something you've never told anyone about your romantic desires?"
];

const selectedQuestions = questions
  .sort(() => 0.5 - Math.random())
  .slice(0, 5);

let currentQuestionIndex = 0;

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Add message to chat
function addMessage(content, sender = "ai") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = content;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Ask next question or show loading
function askNextQuestion() {
  if (currentQuestionIndex < selectedQuestions.length) {
    const question = selectedQuestions[currentQuestionIndex];
    addMessage(question, "ai");
  } else {
    showLoadingAndRedirect();
  }
}

// Handle Send button
sendBtn.addEventListener("click", () => {
  const userText = userInput.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  userInput.value = "";

  currentQuestionIndex++;
  setTimeout(askNextQuestion, 600);
});

// Initial question
askNextQuestion();

// Show loading animation after last question
function showLoadingAndRedirect() {
  // Disable input
  userInput.disabled = true;
  sendBtn.disabled = true;

  // Create loading UI
  const loadingWrapper = document.createElement("div");
  loadingWrapper.classList.add("message", "ai");
  loadingWrapper.innerHTML = `
    <div id="loadingText">AI is finding the best matches for you based on your answers...</div>
    <div id="loadingBar" style="margin-top: 10px; width: 100%; background: #f0e0df; border-radius: 8px; height: 16px;">
      <div id="progress" style="height: 100%; width: 0%; background: #ecaaa4; border-radius: 8px;"></div>
    </div>
    <div id="progressPercent" style="margin-top: 5px; font-size: 0.9rem;">0%</div>
  `;
  chatMessages.appendChild(loadingWrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Animate progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 2; // Increase by 2–9%
    if (progress >= 100) progress = 100;

    document.getElementById("progress").style.width = `${progress}%`;
    document.getElementById("progressPercent").textContent = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        window.location.href = "matching.html";
      }, 600);
    }
  }, 300); // update every 300ms
}
