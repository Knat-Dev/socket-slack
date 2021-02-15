import { getModelForClass, prop } from '@typegoose/typegoose';

export class ChatRoom {
  @prop({ required: 'Name is required!' })
  name: string;
}

export const ChatRoomModel = getModelForClass(ChatRoom, {
  schemaOptions: { timestamps: true },
});
