import { Response } from 'express';
import { MongooseFilterQuery } from 'mongoose';
import { Message, MessageModel } from '../../models';
import { Request } from '../../types';

export const messages = async (
  req: Request<{ channelId: string }>,
  res: Response
) => {
  const LIMIT = 51;
  const { channelId, cursor = null } = req.query;

  const options: MongooseFilterQuery<Message> = {};
  if (cursor) options._id = { $lt: cursor.toString() };
  const messages = await MessageModel.find({
    ...options,
    channelId: channelId?.toString(),
  })
    .sort({ _id: -1 })
    .limit(LIMIT);

  const hasMore = messages.length === LIMIT ? true : false;
  if (hasMore) messages.splice(messages.length - 1, 1);
  res.json({ messages: messages.reverse(), hasMore });
};
