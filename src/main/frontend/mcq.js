const questions = [
  {
    q_id: "q1",
    text: "My everyday communication style is…",
    options: [
      "Short & direct", "Warm & expressive", "Thoughtful & measured",
      "Humorous / meme-heavy", "Depends on the person"
    ]
  },
  {
    q_id: "q2",
    text: "How do you recharge your social battery?",
    options: [
      "Big parties give me energy", "Small hangouts are perfect", "Solo time is essential",
      "Balanced mix of everything", "It changes week-to-week"
    ]
  },
  {
    q_id: "q3",
    text: "Planning style for trips or projects:",
    options: [
      "Detailed checklist & timeline", "Loose outline, improvise later",
      "Spontaneous—decide on the day", "Last-minute crunch works best",
      "Collaborative planning with others"
    ]
  },
  {
    q_id: "q4",
    text: "When conflict appears, I usually…",
    options: [
      "Address it calmly right away", "Take time, then talk it out",
      "Find a compromise quickly", "Prefer to let it blow over",
      "Avoid confrontation altogether"
    ]
  },
  {
    q_id: "q5",
    text: "Which life priorities resonate most with you?",
    options: [
      "Career growth", "Creative expression", "Community & service",
      "Travel & new experiences", "Health & wellbeing"
    ]
  },
  {
    q_id: "q6",
    text: "Your ideal weekend looks like…",
    options: [
      "Outdoor adventure", "Café-hopping & city strolls",
      "Game / movie marathon at home", "Learning a new skill or hobby",
      "Volunteering / community event"
    ]
  },
  {
    q_id: "q7",
    text: "Fitness routine that actually sticks:",
    options: [
      "Daily gym / running plan", "Team or club sports",
      "Yoga / Pilates / meditation", "Dance or movement classes",
      "Not big on regular workouts"
    ]
  },
  {
    q_id: "q8",
    text: "Topics you never tire of discussing:",
    options: [
      "Science & technology", "Arts & culture", "Global issues & politics",
      "Personal growth & psychology", "Sports & fitness"
    ]
  },
  {
    q_id: "q9",
    text: "Money to me is mainly for…",
    options: [
      "Saving & security", "Investing & wealth building",
      "Experiences & memories", "Giving back / philanthropy",
      "Living comfortably day-to-day"
    ]
  },
  {
    q_id: "q10",
    text: "Family life perspective:",
    options: [
      "Want kids in the near future", "Kids someday, not soon",
      "Happier without children", "Open to whatever unfolds",
      "Prefer not to say yet"
    ]
  },
  {
    q_id: "q11",
    text: "Choose the values you hold dearest:",
    options: [
      "Honesty & integrity", "Kindness & empathy", "Ambition & drive",
      "Adventure & spontaneity", "Stability & reliability"
    ]
  },
  {
    q_id: "q12",
    text: "Right now, I'm looking for…",
    options: [
      "Long-term commitment", "Open to long-term but casual start",
      "Short-term fun / dating", "Friendship that could evolve", "Not sure yet"
    ]
  }
];

let currentIndex = 0;
const responses = {};
const chatBox = document.getElementById('chat-messages');
const choiceMap = ['A', 'B', 'C', 'D', 'E'];

const email = localStorage.getItem('registeredEmail');

const displayQuestion = (index) => {
  const q = questions[index];

  const questionDiv = document.createElement('div');
  questionDiv.className = 'message ai';
  questionDiv.innerText = q.text;
  chatBox.appendChild(questionDiv);

  const optionWrapper = document.createElement('div');
  optionWrapper.className = 'option-wrapper';

  q.options.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-button';
    btn.innerText = label;

    btn.onclick = () => {
      responses[q.q_id] = choiceMap[i];

      const responseDiv = document.createElement('div');
      responseDiv.className = 'message user';
      responseDiv.innerText = label;
      chatBox.appendChild(responseDiv);

      optionWrapper.remove();
      currentIndex++;

      if (currentIndex < questions.length) {
        setTimeout(() => displayQuestion(currentIndex), 300);
      } else {
        setTimeout(() => {
          const doneMsg = document.createElement('div');
          doneMsg.className = 'message ai';
          doneMsg.innerText = "Quiz complete! Submitting your answers...";
          chatBox.appendChild(doneMsg);
          sendToBackend();
        }, 300);
      }
    };

    optionWrapper.appendChild(btn);
  });

  chatBox.appendChild(optionWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const sendToBackend = async () => {

  const payload = {
    email: email,
    responses: responses
  };

  try {
    const response = await fetch('http://localhost:8080/api/submit-answers-mcq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Your answers were submitted!');
      localStorage.setItem('registeredEmail', email);  // save to localStorage
      window.location.href = 'ai-chat.html';
    } else {
      const msg = document.createElement('div');
      msg.className = 'message ai';
      msg.innerText = 'Submission failed. Please try again.';
      chatBox.appendChild(msg);
    }
  } catch (err) {
    const msg = document.createElement('div');
    msg.className = 'message ai';
    msg.innerText = 'Network error. Please try again later.';
    chatBox.appendChild(msg);
  }
};

displayQuestion(currentIndex);
