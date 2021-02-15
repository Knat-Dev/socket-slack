import { DocumentType } from '@typegoose/typegoose';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User, UserModel } from '../../models';
import { LoginInput, RegisterInput, Request } from '../../types';
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from '../../utils/Tokens';

export const login = async (req: Request<LoginInput>, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ $or: [{ email }, { name: email }] });
  const errors = [];
  if (!user)
    errors.push({
      field: 'email',
      message: 'Could not find a user matching this email',
    });

  if (!user || errors.length > 0) return res.json({ errors });

  try {
    if (user?.password) {
      const valid = compare(password, user?.password);
      if (!valid) errors.push({ field: 'password', message: 'Bad password' });
      if (errors.length > 0) return res.json({ errors });

      const token = createAccessToken(user);
      sendRefreshToken(res, createRefreshToken(user));
      return res.json({ message: 'You have signed in successfully', token });
    } else throw new Error('ERROR! No password found for user!');
  } catch (e) {
    console.log(e);
  }
};

export const register = async (req: Request<RegisterInput>, res: Response) => {
  const { name, email, password } = req.body;

  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const errors = [];

  try {
    const userAlreadyExists = await UserModel.findOne({
      $or: [{ email }, { name }],
    });
    if (userAlreadyExists) {
      if (userAlreadyExists.email === email)
        errors.push({
          field: 'email',
          message: 'Email already exist',
        });
      if (userAlreadyExists.name === name)
        errors.push({
          field: 'name',
          message: 'Name already exist',
        });
    }
  } catch (e) {
    console.log(e);
  }

  if (!name) errors.push({ field: 'name', message: 'Name is required!' });

  if (!emailRegex.test(email))
    errors.push({ field: 'email', message: 'Email is not valid!' });

  if (password.length < 6)
    errors.push({ field: 'password', message: 'Password is too short' });

  if (errors.length > 0) return res.json({ errors });

  try {
    const hashedPassword = await hash(password, 10);
    await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json({
      message: 'User was created successfully!\nYou may sign in.',
    });
  } catch (e) {
    console.log(e);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('socket_cookie');
  return res.json({ ok: true, accessToken: '' });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.socket_cookie;
  if (!token) return res.send({ ok: false, accessToken: '' });

  let payload: any;
  try {
    payload = verify(token, `${process.env.JWT_REFRESH_SECRET}`);
  } catch (e) {
    return res.send({ ok: false, accessToken: '', ...e });
  }

  const user: DocumentType<User> | null = await UserModel.findById(payload.id);
  if (!user) return res.send({ ok: false, accessToken: '' });

  sendRefreshToken(res, createRefreshToken(user)); // send new refresh token as cookie
  return res.send({ ok: true, accessToken: createAccessToken(user) });
};
