const express = require('express');
const cors = require('cors');

const http = require('http');
const socketIo = require('socket.io');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');



const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });



const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();



// Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------




// Error Handling
app.use(notFound);
app.use(errorHandler);


// // Define routes or middleware as needed
// app.get('/', (req, res) => {
//     res.send('Server is running');
// });



// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000", // Ensure this matches your frontend URL
    },
});

// Define the Socket.io connection
io.on("connection", (socket) => {
    console.log("Connected to Socket.io");


    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new Message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });


    // socket.off("setup", () => {
    //     console.log("USER DISCONNECTED");
    //     socket.leave(userData._id);
    // });


    socket.on("disconnect", () => {
        console.log("Disconnected from Socket.io");
    });
});



// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server Started Running on Port ${PORT}`.yellow.bold);
});
