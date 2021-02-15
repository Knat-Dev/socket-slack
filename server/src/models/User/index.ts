import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { ObjectId } from '../../types';
import { Team } from '../Team';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class User {
  _id?: ObjectId;
  teams?: Team[];

  @prop()
  name: string;

  @prop()
  email: string;

  @prop({ default: [] })
  teamIds?: ObjectId[];

  @prop()
  password?: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: function (_, ret, __) {
        delete ret['password'];
        delete ret['teamIds'];
        return ret;
      },
    },
  },
});
