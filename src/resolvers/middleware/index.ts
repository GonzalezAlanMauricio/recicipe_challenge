import { skip } from 'graphql-resolvers';

export default (email: string) => {
  if (!email) throw new Error('Access denied, a token is needed to access');
  return skip;
};
