import { getCurrentUserFromConfig } from './config.js';
import { getUserByName } from './db/queries/users.js';
import { Feed } from './schema.js';

export const printFeed = (user: any, feed: Feed) => {
  console.log({ user, feed });
};

export async function getCurrentUserDetails() {
  const currentUserName = getCurrentUserFromConfig();

  const currentUser = await getUserByName(currentUserName);

  if (currentUser.length === 0) throw new Error('User does not exist');

  return currentUser[0];
}
