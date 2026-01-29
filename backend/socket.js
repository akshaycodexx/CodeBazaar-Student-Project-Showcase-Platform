const socketIo = require("socket.io");

let io;

exports.initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://code-bazaar-student-project-showcas.vercel.app",
            ],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Join a room based on user ID (sent from client)
        socket.on("join", (userId) => {
            if (userId) {
                socket.join(userId);
                console.log(`User ${userId} joined room ${userId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};

exports.getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
