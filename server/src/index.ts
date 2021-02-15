// Env
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { logger } from './middleware';
import { ChannelModel, MessageModel } from './models';
import { Team, TeamModel } from './models/Team';
import { chatRoomsRoute } from './routes/chatRooms.route';
import { userRouter } from './routes/users.route';
import { Socket } from './types';
import { socketAuth } from './utils';
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

  io.use(socketAuth);

  const users: { [key: string]: boolean } = {};

  io.of((name, auth, next) => {
    if (name === '/not_found') return next(null, false);
    // name will contain a teamId, if team exists in db we will go to next
    next(null, true); // or false, when the creation is denied
  })
    .use(socketAuth)
    .on('connection', (socket: Socket) => {
      console.log(socket.nsp.name + ' ' + socket.user?._id);
    });

  io.on('connect', async (socket: Socket) => {
    if (socket.user && socket.userId) {
      users[socket.userId] = true;

      /**
       * Getting Me Data
       */
      const teams = await TeamModel.aggregate([
        {
          $match: {
            $or: [
              { userIds: { $elemMatch: { $eq: socket.user._id } } },
              { ownerId: socket.user._id },
            ],
          },
        },
        {
          $lookup: {
            from: 'channels',
            localField: '_id',
            foreignField: 'teamId',
            as: 'channels',
          },
        },
      ]);
      socket.user.teams = teams;
      socket.emit('broadcast_me', { ...socket.user });
      socket.on('refresh_page', () =>
        console.log('Page Refreshed: ' + socket.userId)
      );
      // console.log("Connected: " + socket.userId);
      socket.emit('welcome', 'Welcome to the server..');

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

      // Teams
      socket.on('team_created', async ({ team }: { team: Team }) => {
        if (socket.user?._id) {
          const newTeam = await await TeamModel.create({
            ...team,
            ownerId: socket.user?._id,
          });
          const generalChannel = await ChannelModel.create({
            name: 'general',
            teamId: newTeam._id,
          });
          // if general channel exists, the team was created successfully
          if (generalChannel)
            socket.emit('team_created', {
              newTeam: {
                ...newTeam.toJSON(),
                optimisticId: team._id,
                channels: [generalChannel],
              },
            });
        }
      });

      socket.on('disconnect', () => {
        if (socket.userId) delete users[socket.userId];
      });
    }
  });
});
