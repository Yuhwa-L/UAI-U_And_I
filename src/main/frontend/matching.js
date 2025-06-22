const matches = [
    {
        name: "Aarti",
        age: 24,
        photo: "photos/woman1.jpeg",
        summary: "Aarti is a thoughtful bookworm who spends weekends hiking and journaling. She's looking for someone who values calm moments and emotional presence.",
        preferences: "Hiking, tea dates, novels, indie films, journaling"
    },
    {
        name: "Aria",
        age: 27,
        photo: "photos/woman2.jpeg",
        summary: "Aria is a jazz guitarist and weekend foodie who seeks genuine connection through conversation and shared creativity.",
        preferences: "Jazz, ramen shops, acoustic sets, rooftop talks"
    },
    {
        name: "Zoe",
        age: 22,
        photo: "photos/woman3.jpeg",
        summary: "Zoe travels with her film camera and finds joy in street art, poetry, and real connection.",
        preferences: "Photography, poetry, hidden cafés, night walks"
    },
    {
        name: "Tania",
        age: 26,
        photo: "photos/woman4.jpeg",
        summary: "Tania is a calm, nature-loving software dev who values silence, reflection, and slow mornings.",
        preferences: "Biking trails, black coffee, nature talks, deep films"
    },
    {
        name: "Nikita",
        age: 25,
        photo: "photos/woman5.jpeg",
        summary: "Nikita is a yoga instructor and visual artist who thrives in nature and finds peace in minimalism and kindness.",
        preferences: "Yoga, film photos, nature journaling, slow living"
    }
];

let currentIndex = 0;

const card = document.getElementById('card');
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');

function renderSummary(index) {
    const match = matches[index];
    cardFront.innerHTML = `
    <h3>Summary</h3>
    <p>${match.summary}</p>
  `;
}

function renderPhoto(index) {
    const match = matches[index];
    cardBack.innerHTML = `
    <img src="${match.photo}" alt="${match.name}" />
    <h3>${match.name}, ${match.age}</h3>
    <p>${match.preferences}</p>
  `;
}

function showMatch(index) {
    const match = matches[index];
    if (!match) {
        // Optionally show a short goodbye message before redirecting
        cardFront.innerHTML = `<h3>No more matches</h3><p>Redirecting...</p>`;
        cardBack.innerHTML = "";
        likeBtn.style.display = 'none';
        dislikeBtn.style.display = 'none';

        // Redirect to next page after 3 second
        setTimeout(() => {
            window.location.href = "home-loggedIn.html"
        }, 3000);
        return;
    }

    card.classList.remove('flipped');
    renderSummary(index);

    setTimeout(() => {
        renderPhoto(index);
    }, 1000);
}

function showFeedbackMessage(text) {
    let messageBox = document.getElementById('feedbackMessage');

    // Create element if it doesn't exist
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'feedbackMessage';
        messageBox.style.marginTop = '1rem';
        messageBox.style.fontSize = '0.95rem';
        messageBox.style.color = '#4B5563';
        messageBox.style.transition = 'opacity 0.3s ease';
        messageBox.style.opacity = '1';
        messageBox.style.textAlign = 'center';
        document.querySelector('.match-wrapper').appendChild(messageBox);
    }

    messageBox.textContent = text;
    messageBox.style.opacity = '1';

    // Hide after 2 seconds
    setTimeout(() => {
        messageBox.style.opacity = '0';
    }, 2000);
}


// Handle flipping
card.addEventListener('click', () => {
    card.classList.toggle('flipped');
});

// Move to next profile
function goToNext() {
    currentIndex++;
    showMatch(currentIndex);
}

// Buttons
likeBtn.addEventListener('click', () => {
    console.log("✔ Liked:", matches[currentIndex]?.name);
    goToNext();
});

dislikeBtn.addEventListener('click', () => {
    console.log("✕ Skipped:", matches[currentIndex]?.name);
    showFeedbackMessage("AI is improving match making based on your selection");
    goToNext();
});


// Start
showMatch(currentIndex);
