const messagesContainer = document.getElementById('chat-messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let questions = [];
let answers = [];
let currentIndex = 0;

const API_BASE = 'http://localhost:8080'; // Change this to your actual backend base URL

// 1. Get email from localStorage and check it
const email = localStorage.getItem('registeredEmail');
if (!email) {
  alert("Email not found. Please register first.");
}

// 2. Load questions from backend
async function loadQuestions() {
  const payload = {
    email: email
  };

  try {
    const response = await fetch(`${API_BASE}/api/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();

      // Flatten and extract only the "text" field from every question
      questions = data.flatMap(item => 
        (item.questions || []).map(q => q.text)
      );

      console.log("Loaded questions:", questions); // Debug output
      showNextQuestion(); // Start the conversation
    } else {
      appendMessage('ai', 'Failed to fetch questions from the server.');
    }

  } catch (err) {
    console.error('Error loading questions:', err);
    appendMessage('ai', 'Sorry, failed to load questions.');
  }
}

// 3. Show each question one by one
function showNextQuestion() {
  if (currentIndex < questions.length) {
    appendMessage('ai', questions[currentIndex]);
  } else {
    finishAndSend();
  }
}

// 4. Append message to UI
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender.toLowerCase());
  msg.innerText = text;
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 5. Handle send button click
sendBtn.addEventListener('click', () => {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage('user', input);
  answers.push(input);
  userInput.value = '';
  currentIndex++;
  setTimeout(showNextQuestion, 300); // Delay to simulate AI "thinking"
});

// 6. Optional: Handle Enter key for user input
userInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

// 7. Final step: send answers to backend
async function finishAndSend() {
  try {
    const payload = {
      email,
      answers
    };

    const res = await fetch(`${API_BASE}/api/save-answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      appendMessage('ai', 'All done! Redirecting...');
      setTimeout(() => {
        window.location.href = 'home-loggedIn.html';
      }, 1500);
    } else {
      appendMessage('ai', 'Oops. Something went wrong saving your answers.');
    }
  } catch (err) {
    console.error('Error sending answers:', err);
    appendMessage('ai', 'An error occurred. Please try again.');
  }
}

// 8. Start everything
loadQuestions();
