import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import User from '../entities/User';

export default async (req: {
  headers: { authorization: string };
  userId: number | null; email: string | null;
}): Promise<void> => {
  req.email = null;
  req.userId = null;
  try {
    if (req.headers.authorization) {
      const bearerHeader = req.headers.authorization || '';
      const token = bearerHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
      const user = await getConnection()
        .getRepository(User).findOne({ where: { email: payload.email }, relations: ['recipes'] });
      if (!user) throw new Error('Incorrect token');
      req.email = payload.email;
      req.userId = user.id;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Incorrect token');
  }
};
