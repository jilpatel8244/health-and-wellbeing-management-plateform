module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("a user connected and their socket id is : " , socket.id);

        socket.on("add-user-to-room", async (userId) => {
            if (userId) {
                socket.join(`room_${userId}`);
            }
        });

        // let allRooms = io.sockets.adapter.rooms;
        // allRooms.forEach((room, roomName) => {
        //     console.log('room name is : ', roomName);
        // });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    })
}