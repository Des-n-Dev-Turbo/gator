import {
  handleAddFeed,
  handleFetchFeed,
  handleFetchFeeds,
  handleFollowFeed,
  handleFollowing,
  handleList,
  handleLogin,
  handleRegister,
  handleReset,
  handleUnfollowFeed,
  registerCommand,
  runCommand,
} from './commands.js';
import { middlewareLoggedIn } from './middleware.js';

async function main() {
  const commandsRegistry = {};

  registerCommand(commandsRegistry, 'login', handleLogin);
  registerCommand(commandsRegistry, 'register', handleRegister);
  registerCommand(commandsRegistry, 'reset', handleReset);
  registerCommand(commandsRegistry, 'users', handleList);
  registerCommand(commandsRegistry, 'agg', handleFetchFeed);
  registerCommand(
    commandsRegistry,
    'addfeed',
    middlewareLoggedIn(handleAddFeed),
  );
  registerCommand(commandsRegistry, 'feeds', handleFetchFeeds);
  registerCommand(
    commandsRegistry,
    'follow',
    middlewareLoggedIn(handleFollowFeed),
  );
  registerCommand(
    commandsRegistry,
    'unfollow',
    middlewareLoggedIn(handleUnfollowFeed),
  );
  registerCommand(
    commandsRegistry,
    'following',
    middlewareLoggedIn(handleFollowing),
  );

  const requiredArgs = process.argv.slice(2);
  if (requiredArgs.length === 0) {
    throw new Error('No commands given');
  }

  const [cmdName, args] = [requiredArgs[0], requiredArgs.slice(1)];

  await runCommand(commandsRegistry, cmdName, ...args);

  process.exit(0);
}

main();
