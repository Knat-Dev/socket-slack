import { Response } from 'express';
import { ChatRoomModel } from '../../models';
import { ChatRoomInput, Request } from '../../types';

export const createChatRoom = async (
  req: Request<ChatRoomInput>,
  res: Response
) => {
  const userId = req.payload?.id;
  if (!userId) return;

  const { name } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ errors: [{ field: 'name', message: 'Name is required!' }] });

  const chatRoomAlreadyExists = await ChatRoomModel.findOne({ name });

  if (chatRoomAlreadyExists)
    return res
      .status(400)
      .json({ errors: [{ field: 'name', message: 'Room already exists!' }] });

  const chatRoom = await ChatRoomModel.create({ name });
  if (!chatRoom)
    return res.status(500).json({ message: 'Something went wrong' });

  return res.status(200).json('Chatroom created!');
};

export const getAllRooms = async (req: Request, res: Response) => {
  const userId = req.payload?.id;
  if (!userId) return;

  return res.json(await ChatRoomModel.find());
};
