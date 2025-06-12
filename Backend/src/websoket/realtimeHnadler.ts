// import { Server } from 'socket.io';
// import { Socket } from 'socket.io';

// const activeconnections = new Map<string, string>();
// const WorkshopConnection = new Map<string, string>();


// io.on('connection', (socket: Socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on('join', (data) => {
//         try {
//             const { userId, role} = data;
//             activeconnections.set(socket.id, {userId, role});
            
//             if (role === 'workshop') {
//                 workshopConnection.set(socket.id, userId);
//                 socket.join(`workshop_${userId}`);
//                 console.log(`Workshop user ${userId} connected with socket ID: ${socket.id}`);
                
//             }else {
//                 socket.join(`user_${userId}`);
//                 console.log(`User ${userId} connected with socket ID: ${socket.id}`);
//             }
            
//         }catch (error) {
//             console.error('Error in join event:', error);
//             socket.emit('error', { message: 'Failed to join', error: error.message });
//         }
//     });
// });