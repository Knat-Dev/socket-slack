import { Response } from 'express';
import { MongooseFilterQuery } from 'mongoose';
import { ChannelModel, Message } from '../../models';
import { Request } from '../../types';

export const channels = async (
  req: Request<{ channelId: string }>,
  res: Response
) => {
  const LIMIT = 6;
  const { teamId, cursor = null } = req.query;

  const options: MongooseFilterQuery<Message> = {};
  if (cursor) options._id = { $lt: cursor.toString() };
  const messages = await ChannelModel.find({
    ...options,
    teamId: teamId?.toString(),
  })
    .sort({ _id: -1 })
    .limit(LIMIT);

  const hasMore = messages.length === LIMIT ? true : false;
  if (hasMore) messages.splice(messages.length - 1, 1);
  res.json({ messages: messages.reverse(), hasMore });
};
