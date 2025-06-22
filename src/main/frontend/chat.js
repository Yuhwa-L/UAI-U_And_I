const chats = {
  Emma: [
    { from: 'them', text: "Hey! I'm excited we matched 💕" },
    { from: 'you', text: "Same here! How's your day going?" },
    { from: 'them', text: "Pretty good. Just got back from the art museum!" },
    { from: 'you', text: "Ooh I love museums. Which one?" },
    { from: 'them', text: "The Getty. Stunning view from the garden." },
    { from: 'you', text: "Let's go together next time 😄" }
  ],
  Olivia: [
    { from: 'them', text: "Hi! You seem fun 😄" },
    { from: 'you', text: "Haha thank you! I read your bio, super interesting." },
    { from: 'them', text: "I travel a lot. What's your dream country to visit?" },
    { from: 'you', text: "Japan for sure! Culture + food 😍" }
  ],
  Sophia: [
    { from: 'them', text: "Yoga + ramen. That's me in two words lol" },
    { from: 'you', text: "LOL relatable. Let's chat more soon!" },
    { from: 'them', text: "Do you hike? I love Runyon Canyon." },
    { from: 'you', text: "Yes! Early morning hikes and smoothies after." }
  ]
};

const chatList = document.getElementById('chat-list');
const chatMessages = document.getElementById('chat-messages');
const chatPartnerName = document.getElementById('chat-partner-name');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let currentChat = 'Emma';

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

function loadChat(name) {
  chatPartnerName.textContent = name;
  chatMessages.innerHTML = '';

  chats[name].forEach((msg) => {
    const div = document.createElement('div');
    div.className = `message ${msg.from}`;
    div.textContent = msg.text;
    chatMessages.appendChild(div);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (text !== "") {
    chats[currentChat].push({ from: 'you', text });
    messageInput.value = "";
    loadChat(currentChat);
  }
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

renderChatList();
loadChat(currentChat);
