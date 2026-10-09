import { getCurrentUserDetails } from './lib/util.js';

export type UserCommandHandler = (
  cmdName: string,
  user: Awaited<ReturnType<typeof getCurrentUserDetails>>,
  ...args: string[]
) => Promise<void>;

export const middlewareLoggedIn = (handler: UserCommandHandler) => {
  return async (cmdName: string, ...args: string[]) => {
    const currentUser = await getCurrentUserDetails();
    if (!currentUser) {
      throw new Error('User not valid');
    }

    await handler(cmdName, currentUser, ...args);
  };
};
