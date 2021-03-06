import {
  getModelForClass,
  index,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { ObjectId } from '../../types';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@index({ name: 1, ownerId: 1 }, { unique: true })
export class Team {
  _id?: string;
  optimisticId?: string;

  @prop()
  name: string;

  @prop()
  ownerId: ObjectId;

  @prop()
  userIds: ObjectId[];
}

export const TeamModel = getModelForClass(Team, {
  schemaOptions: {
    timestamps: true,
  },
});
