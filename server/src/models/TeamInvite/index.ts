import {
  getModelForClass,
  index,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { ObjectId } from '../../types';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@index({ createdAt: 1 }, { expireAfterSeconds: 604800 }) // 604800 seconds = 1 week
export class TeamInvite {
  _id?: string;

  @prop()
  teamId: ObjectId;

  @prop()
  code: string;
}

export const TeamInviteModel = getModelForClass(TeamInvite, {
  schemaOptions: {
    timestamps: true,
  },
});
