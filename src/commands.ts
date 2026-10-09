import { readConfig, setUser } from './lib/config.js';
import {
  createFeedFollow,
  getFeedFollowsForUser,
  removeFeedFollow,
} from './lib/db/queries/feedFollows.js';
import { addFeed, getAllFeeds, getFeedByUrl } from './lib/db/queries/feeds.js';
import {
  createUser,
  deleteAllUsers,
  getAllUsers,
  getUserByName,
} from './lib/db/queries/users.js';
import { fetchFeed } from './lib/rss.js';
import { getCurrentUserDetails, printFeed } from './lib/util.js';

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

type CommandsRegistry = Record<string, CommandHandler>;

export const handleLogin: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0)
    throw new Error(
      'the login handler expects a single argument, the username',
    );

  const result = await getUserByName(args[0]);

  if (result.length === 0) throw new Error('User does not exist');

  setUser(args[0]);

  console.log('The user has been set');
};

export const handleRegister: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0)
    throw new Error(
      'the login handler expects a single argument, the username',
    );

  const result = await createUser(args[0]);
  setUser(result.name);

  console.log(`User ${result.name} was created.`);
};

export const handleReset: CommandHandler = async (cmdName) => {
  await deleteAllUsers();
};

export const handleList: CommandHandler = async (cmdName) => {
  const list = await getAllUsers();

  const currentConfig = readConfig();

  const config = JSON.parse(currentConfig);

  const currentUser = config.currentUserName;

  list.forEach((user) => {
    console.log(
      `* ${user.name}${user.name === currentUser ? ' (current)' : ''}`,
    );
  });
};

export const handleFetchFeed: CommandHandler = async (cmdName) => {
  const feed = await fetchFeed('https://www.wagslane.dev/index.xml');

  console.log(JSON.stringify(feed, null, 2));
};

export const handleAddFeed = async (
  cmdName: string,
  user: Awaited<ReturnType<typeof getCurrentUserDetails>>,
  ...args: string[]
) => {
  if (args.length < 2) {
    throw new Error('Needs an argument link and feed name to add the feed');
  }

  const [name, url] = args;

  const feed = await addFeed(name, url, user.id);

  const followOwnFeed = await createFeedFollow(feed.id, user.id);

  printFeed(user, feed);
  console.log('Created and following own feed', followOwnFeed);
};

export const handleFetchFeeds: CommandHandler = async (cmdName) => {
  const results = await getAllFeeds();

  results.forEach((result) => {
    console.log({
      name: result.name,
      link: result.url,
      author: result.userName,
    });
  });
};

export const handleFollowFeed = async (
  cmdName: string,
  user: Awaited<ReturnType<typeof getCurrentUserDetails>>,
  ...args: string[]
) => {
  if (args.length < 1) {
    throw new Error('Need feed url to follow');
  }

  const feed = await getFeedByUrl(args[0]);

  const followFeed = await createFeedFollow(feed.id, user.id);

  console.log('Feed followed', followFeed);
  printFeed(user, feed);
};

export const handleUnfollowFeed = async (
  cmdName: string,
  user: Awaited<ReturnType<typeof getCurrentUserDetails>>,
  ...args: string[]
) => {
  if (args.length < 1) {
    throw new Error('Need feed url to follow');
  }

  const feed = await getFeedByUrl(args[0]);

  const unfollowedFeedId = await removeFeedFollow(feed.id, user.id);

  console.log('Feed unfollowed', unfollowedFeedId);
};

export const handleFollowing = async (
  cmdName: string,
  user: Awaited<ReturnType<typeof getCurrentUserDetails>>,
) => {
  const followingFeeds = await getFeedFollowsForUser(user.id);

  console.log(`You ${user.name} are following the feeds mentioned below -`);
  followingFeeds.forEach((follow) => {
    console.log(`- ${follow.feedName}`);
  });
};

export const registerCommand = (
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) => {
  registry[cmdName] = handler;
};

export const runCommand = async (
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) => {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error();
  }

  await handler(cmdName, ...args);
};
