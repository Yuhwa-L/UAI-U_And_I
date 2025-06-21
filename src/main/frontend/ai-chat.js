const messagesContainer = document.getElementById('chat-messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let questions = [];
let answers = [];
let currentIndex = 0;

// 1. Get email from localStorage
const email = localStorage.getItem('registeredEmail');

// 2. Load questions from backend
async function loadQuestions() {
  try {
    const res = await fetch('https://your-backend.com/api/get-questions'); // Change to your real backend URL
    const data = await res.json();
    questions = data.questions; // Expecting { questions: [q1, q2, q3, q4, q5] }
    showNextQuestion();
  } catch (err) {
    console.error('Error loading questions:', err);
    appendMessage('AI', 'Sorry, failed to load questions.');
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
  msg.classList.add('message', sender);
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
  setTimeout(showNextQuestion, 300); // Delay to simulate thinking
});

// 6. Final step: send answers to backend
async function finishAndSend() {
  try {
    const payload = {
      email,
      answers
    };

    const res = await fetch('https://your-backend.com/api/save-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      appendMessage('ai', 'All done! Redirecting...');
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1500);
    } else {
      appendMessage('ai', 'Oops. Something went wrong saving your answers.');
    }
  } catch (err) {
    console.error('Error sending answers:', err);
    appendMessage('ai', 'An error occurred. Please try again.');
  }
}

// 7. Start everything
loadQuestions();
