// Socket.io for real-time chat (replace with your server setup)
const socket = io(); 

let userName = "";
let uniqueCode = Math.random().toString(36).substr(2, 6); // Generate 6-char unique code
let userGender = "";

// === REGISTER USER ===
function registerUser() {
    userName = document.getElementById("name").value;
    userGender = document.getElementById("gender").value;

    if (userName.trim() === "") {
        alert("Enter a valid name");
        return;
    }

    // Show chat section & update UI
    document.getElementById("user-info").style.display = "none";
    document.getElementById("chat-section").style.display = "block";
    document.getElementById("username").innerText = userName;
    document.getElementById("uniqueCode").innerText = uniqueCode;

    // Background animation based on gender
    changeBackground(userGender);
}

// === CHANGE BACKGROUND COLOR BASED ON GENDER ===
function changeBackground(gender) {
    let body = document.body;

    if (gender === "male") {
        body.style.transition = "background 1s ease";
        body.style.backgroundColor = "#007BFF"; // Blue
        setTimeout(() => body.style.backgroundColor = "#1a1a1a", 1000);
    } else if (gender === "female") {
        body.style.transition = "background 1s ease";
        body.style.backgroundColor = "#FF69B4"; // Pink
        setTimeout(() => body.style.backgroundColor = "#1a1a1a", 1000);
    } else {
        body.style.transition = "background 1s ease";
        body.style.background = "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
        setTimeout(() => body.style.background = "#1a1a1a", 1000);
    }
}

// === CONNECT WITH UNIQUE CODE ===
function connectWithCode() {
    let code = document.getElementById("inviteCode").value;
    if (code.trim() === "") {
        alert("Enter a valid code");
        return;
    }
    alert("Connected with: " + code);
    // TODO: Handle connection logic with WebSocket or Firebase
}

// === ENCRYPT MESSAGE ===
function encryptMessage(message) {
    return btoa(message); // Simple Base64 encoding (replace with better encryption)
}

// === DECRYPT MESSAGE ===
function decryptMessage(encryptedMessage) {
    return atob(encryptedMessage);
}

// === SEND MESSAGE ===
function sendMessage() {
    let messageBox = document.getElementById("chat-box");
    let message = document.getElementById("message").value;
    if (message.trim() === "") return;

    let messageId = Date.now(); // Unique ID for message tracking
    let encryptedMessage = encryptMessage(message);

    let msgElement = document.createElement("div");
    msgElement.className = "message";
    msgElement.id = `msg-${messageId}`; 
    msgElement.innerHTML = `
        <strong>${userName}:</strong> ${message}
        <span class="receipt" id="status-${messageId}">🟡 Sent</span>
    `;
    messageBox.appendChild(msgElement);
    document.getElementById("message").value = "";

    // Send message to server
    socket.emit("send-message", { messageId, encryptedMessage });

    // Auto-delete message with shatter animation
    setTimeout(() => {
        msgElement.classList.add("shatter");
        setTimeout(() => msgElement.remove(), 600);
    }, 10000);
}

// === RECEIVE MESSAGE ===
socket.on("receive-message", (data) => {
    let { messageId, encryptedMessage, sender } = data;
    let messageBox = document.getElementById("chat-box");

    let decryptedMessage = decryptMessage(encryptedMessage);
    let msgElement = document.createElement("div");
    msgElement.className = "message";
    msgElement.innerHTML = `
        <strong>${sender}:</strong> ${decryptedMessage}
        <span class="receipt" id="status-${messageId}">🟢 Delivered</span>
    `;
    messageBox.appendChild(msgElement);

    // Simulate read receipt after 2 seconds
    setTimeout(() => {
        document.getElementById(`status-${messageId}`).innerText = "✔✔ Seen";
        socket.emit("read-receipt", { messageId });
    }, 2000);
});

// === UPDATE READ RECEIPT STATUS ===
socket.on("read-receipt", (data) => {
    let { messageId } = data;
    let statusElement = document.getElementById(`status-${messageId}`);
    if (statusElement) {
        statusElement.innerText = "✔✔ Seen";
    }
});

// === ADD ENTER KEY FUNCTIONALITY ===
document.getElementById("name").addEventListener("keypress", (event) => {
    if (event.key === "Enter") registerUser();
});

document.getElementById("inviteCode").addEventListener("keypress", (event) => {
    if (event.key === "Enter") connectWithCode();
});

document.getElementById("message").addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});
