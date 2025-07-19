import express from 'express';
import { createServer } from 'http';   
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://127.0.0.1:5500", // Update this to your frontend URL
    }
})

// Get __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//listen
io.on('connection', (socket) => {
    io.emit('user connect')
    console.log('a user connected', socket.id || 'unknown');
    socket.on("message",(message)=>{
        console.log('user mesasage' ,message);
        io.emit("chat message",message)
    })
    socket.on('typing', (message) => {
        socket.broadcast.emit('typing', message); // notify others
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing'); // notify others
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnect')
        console.log('user disconnected');
    });

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});