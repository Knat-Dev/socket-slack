import { getModelForClass, mongoose, prop } from '@typegoose/typegoose';

export class User {
  _id?: mongoose.Types.ObjectId;

  @prop({ required: 'Name is required!' })
  name: string;

  @prop({ required: 'Email is required!' })
  email: string;

  @prop({ required: 'Password is required!' })
  password?: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, opt) {
        delete ret['password'];
        return ret;
      },
    },
  },
});
