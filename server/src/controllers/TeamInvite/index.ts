import { DocumentType, mongoose } from '@typegoose/typegoose';
import { randomBytes } from 'crypto';
import { Response } from 'express';
import { TeamInvite, TeamInviteModel } from '../../models';
import { TeamModel } from '../../models/Team';
import { Request } from '../../types';

export const getInviteLink = async (req: Request, res: Response) => {
  const { teamId } = req.query as { teamId: string };
  const team = await TeamModel.findById(mongoose.Types.ObjectId(teamId));
  if (!team) throw new Error('Team could not be found!');

  let teamInvite: DocumentType<TeamInvite> | null = null;
  teamInvite = await TeamInviteModel.findOne({
    teamId: mongoose.Types.ObjectId(teamId),
  });
  if (!teamInvite) {
    const code = randomBytes(12).toString('base64');
    teamInvite = await TeamInviteModel.create({
      code,
      teamId: mongoose.Types.ObjectId(teamId),
    });
  }
  res.json(teamInvite);
};
