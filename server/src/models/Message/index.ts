import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { User } from '../User';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Message {
  _id?: string;

  @prop({ required: 'Channel id is required', type: String })
  channelId: string;

  @prop({ required: 'User id is required', type: User })
  user: Omit<User, 'password'>;

  @prop({ required: 'text is required!' })
  text: string;

  optimisticId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
});
