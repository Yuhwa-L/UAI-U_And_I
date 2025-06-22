const chats = {
  Olivia: [], // Simulating empty chat
  Emma: [
    { from: 'them', text: "Hey! I'm excited we matched 💕", time: "Jun 21, 10:02 PM" },
    { from: 'you', text: "Same here! How's your day going?", time: "Jun 21, 10:07 PM" },
    { from: 'them', text: "Pretty good. Just got back from the art museum!", time: "Jun 21, 10:23 PM" },
    { from: 'you', text: "Ooh I love museums. Which one?", time: "Jun 21, 10:42 PM" },
    { from: 'them', text: "The Getty. Stunning view from the garden.", time: "Jun 21, 10:59 PM" },
    { from: 'you', text: "Let's go together next time 😄", time: "Jun 21, 11:10 PM" }
  ],
  Sophia: [
    { from: 'them', text: "Yoga + ramen. That's me in two words lol", time: "Jun 22, 1:30 AM" },
    { from: 'you', text: "LOL relatable. Let's chat more soon!", time: "Jun 22, 1:48 AM" },
    { from: 'them', text: "Do you hike? I love Runyon Canyon.", time: "Jun 22, 2:32 AM" },
    { from: 'you', text: "Yes! Early morning hikes and smoothies after.", time: "Jun 22, 2:57 AM" }
  ]
};

const chatList = document.getElementById('chat-list');
const chatMessages = document.getElementById('chat-messages');
const chatPartnerName = document.getElementById('chat-partner-name');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let currentChat = null;

// Render chat list
function renderChatList() {
  for (let name in chats) {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', () => {
      currentChat = name;
      loadChat(name);
    });
    chatList.appendChild(li);
  }
}

// Format timestamps
function formatTimestamp(date) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleString('en-US', options);
}

// Load chat content
function loadChat(name) {
  chatPartnerName.textContent = name;
  chatMessages.innerHTML = '';
  document.getElementById('initial-placeholder').style.display = 'none';

  const messages = chats[name];

  if (messages.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'message them';
    placeholder.textContent = '🗨️ This is the beginning of your conversation';
    chatMessages.appendChild(placeholder);
  } else {
    messages.forEach((msg) => {
      const div = document.createElement('div');
      div.className = `message ${msg.from}`;
      div.innerHTML = `
        <div>${msg.text}</div>
        <div class="timestamp">${msg.time}</div>
      `;
      chatMessages.appendChild(div);
    });
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle message send
sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (text !== "" && currentChat) {
    const now = new Date();
    const formattedTime = formatTimestamp(now);
    chats[currentChat].push({ from: 'you', text, time: formattedTime });
    messageInput.value = "";
    loadChat(currentChat);
  }
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Initial empty chat placeholder before any selection
function showInitialPlaceholder() {
  chatPartnerName.textContent = "Select a chat";
  chatMessages.innerHTML = '';
  document.getElementById('initial-placeholder').style.display = 'block';
}

renderChatList();
showInitialPlaceholder();
