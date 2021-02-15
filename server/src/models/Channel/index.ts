import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { ObjectId } from '../../types';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Channel {
  _id?: ObjectId;

  @prop({ required: 'Name is required!' })
  name: string;

  @prop()
  teamId: ObjectId;
}

export const ChannelModel = getModelForClass(Channel, {
  schemaOptions: {
    timestamps: true,
  },
});
