// Firebase Configuration (Replace with your Firebase config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to send user message
document.getElementById("sendButton").addEventListener("click", sendMessage);

function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();

    if (message) {
        // Save user message to Firestore
        db.collection("messages").add({
            text: message,
            sender: "user",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        input.value = "";

        // Generate automated response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            if (botResponse) {
                db.collection("messages").add({
                    text: botResponse,
                    sender: "support",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        }, 1000); // 1-second delay for bot response
    }
}

// Function to get bot response based on keywords
function getBotResponse(message) {
    message = message.toLowerCase();

    if (message.includes("rental policy")) {
        return "Our rental policy allows daily, weekly, and monthly rentals. Please refer to our website for more details.";
    } else if (message.includes("cancellation")) {
        return "You can cancel your booking up to 24 hours before the rental time without a fee.";
    } else if (message.includes("support")) {
        return "I'm here to help! Please ask me any questions.";
    } else if (message.includes("hours")) {
        return "Our rental locations are open from 8 AM to 8 PM daily.";
    } else {
        return "Thank you for your message. A support representative will assist you shortly.";
    }
}

// Listen for new messages
db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

    snapshot.forEach(doc => {
        const msg = doc.data();
        const messageElem = document.createElement("div");
        messageElem.classList.add("message", msg.sender);
        messageElem.textContent = msg.text;
        chatMessages.appendChild(messageElem);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
});



function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector(".faq-icon");
    
    if (answer.style.display === "block") {
        answer.style.display = "none";
        icon.innerText = "+";
    } else {
        answer.style.display = "block";
        icon.innerText = "-";
    }
}


// Show scroll-to-top button when scrolling down
window.onscroll = function () {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Scroll to top function when the button is clicked
document.getElementById('scrollToTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
