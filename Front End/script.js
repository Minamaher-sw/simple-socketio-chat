var socket = io("http://localhost:3000");
var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');
const disconnect = document.getElementById('disconnect');

let typing = false;
let timeout;

// Assume current user is 'sender'. Replace with your real user ID check in production
const currentUser = "user1";

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('message', { user: currentUser, text: input.value });
    input.value = '';
  }
});

socket.on("chat message", (msg) => {
  var item = document.createElement('li');

  if (msg.user === currentUser) {
    item.classList.add('sender');
  } else {
    item.classList.add('receiver');
  }

  item.textContent = msg.text;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

input.addEventListener('keydown', () => {
  if (!typing) {
    typing = true;
    socket.emit('typing', 'User is typing...');
    timeout = setTimeout(stopTyping, 1000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(stopTyping, 1000);
  }
});

function stopTyping() {
  typing = false;
  socket.emit('stop typing');
}

socket.on('typing', (message) => {
  typingIndicator.textContent = message;
});

socket.on('stop typing', () => {
  typingIndicator.textContent = '';
});

socket.on('user disconnect', () => {
  disconnect.textContent = "User disconnected";
  setTimeout(() => { disconnect.textContent = ''; }, 3000);
});

socket.on('user connect', () => {
  disconnect.textContent = "User connected";
  setTimeout(() => { disconnect.textContent = ''; }, 3000);
});
