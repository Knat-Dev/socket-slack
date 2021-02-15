import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { ObjectId } from '../../types';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
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
