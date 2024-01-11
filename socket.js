import {Server} from "socket.io";

const initializeSocket=(server)=>{
    const io = new Server(server, {
        path: "/chat",
        cors: {
            origin: [
                "http://localhost:3000",
                "https://pose2team.vercel.app",
            ],
        },
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", (data) => {
            socket.join(data);
        });

        socket.on("send_message", (data) => {
            socket.to(data.room).emit("receive_message", data);
            console.log(data);
        });
    });
    return io;
}
export default initializeSocket;