// Env
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { logger } from './middleware';
import { MessageModel, UserModel } from './models';
import { chatRoomsRoute } from './routes/chatRooms.route';
import { userRouter } from './routes/users.route';
import { Socket } from './types';
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const app = express();

// Express middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

// Routers
app.use('/users', userRouter);
app.use('/chats', chatRoomsRoute);

const http = createServer(app);

http.listen(port, async () => {
  console.log(`Server is listening on ${process.env.HOST_URL}:${port}`);
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('Connected to MongoDB!');

  const io = new Server(http, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket: Socket, next: any) => {
    const token = socket.handshake.query.token as string;

    try {
      const payload = verify(token, process.env.JWT_SECRET) as { id: string };
      socket.userId = payload.id;
      const user = await UserModel.findById(payload.id);

      if (user) {
        socket.user = user;
        return next();
      }
    } catch (e) {
      return socket.disconnect();
    }
  });

  const users: { [key: string]: boolean } = {};

  io.on('connect', async (socket: Socket) => {
    if (socket.user && socket.userId) {
      users[socket.userId] = true;
      // console.log("Connected: " + socket.userId);
      socket.emit('welcome', 'Welcome to the server..');
      socket.emit('broadcast_me', socket.user);
      socket.on('refresh_page', () =>
        console.log('Page Refreshed: ' + socket.userId)
      );

      // Room joining ability
      socket.on('join_room', ({ id }) => {
        if (!socket.rooms.has(id)) {
          console.log('Joined Room: ' + id);
          socket.join(id);
        }
      });

      // leave room
      socket.on('leave_room', ({ id }) => {
        console.log('Left Room: ' + id);
        socket.leave(id);
      });

      // Messages
      socket.on(
        'message_from_client',
        async ({
          channelId,
          text,
          optimisticId,
        }: {
          [key: string]: string;
        }) => {
          if (socket.user && socket.userId && text.trim()) {
            const message = await MessageModel.create({
              channelId,
              text,
              user: socket.user,
            });
            message.optimisticId = optimisticId;
            io.to(channelId).emit('message_from_server', {
              ...message.toJSON(),
              optimisticId,
            });
          }
        }
      );

      socket.on('message_deleted', async ({ id }) => {
        const message = await MessageModel.findById(id);
        if (
          message &&
          message.user._id &&
          mongoose.Types.ObjectId(socket.userId).equals(message.user._id)
        ) {
          await message.remove();
          io.to(message.channelId).emit('message_deleted', { id });
        }
      });

      socket.on('message_edited', async ({ id, text }) => {
        const message = await MessageModel.findById(id);
        if (
          message &&
          message.user._id &&
          mongoose.Types.ObjectId(socket.userId).equals(message.user._id)
        ) {
          await MessageModel.findByIdAndUpdate(id, { text });
          io.to(message.channelId).emit('message_edited', { id, text });
        }
      });

      // Typing users
      socket.on('i_am_typing', ({ id }) => {
        if (socket.user?.name) {
          socket.to(id).emit('user_started_typing', socket.user);
        }
      });

      socket.on('i_stopped_typing', ({ id }) => {
        if (socket.user?.name) {
          socket.to(id).emit('user_stopped_typing', socket.user);
        }
      });

      socket.on('disconnect', () => {
        if (socket.userId) delete users[socket.userId];
      });
    }
  });
});
