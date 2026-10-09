import { and, eq } from 'drizzle-orm';
import { feedFollows, feeds, users } from '../../schema.js';
import { db } from '../index.js';

export const createFeedFollow = async (
  feedId: string,
  currentUserId: string,
) => {
  const [result] = await db
    .insert(feedFollows)
    .values({ feedId, userId: currentUserId })
    .returning();

  return result;
};

export const getFeedFollowsForUser = async (userId: string) => {
  const results = await db
    .select({ id: feedFollows.id, feedName: feeds.name, follower: users.name })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

  return results;
};

export const removeFeedFollow = async (
  feedId: string,
  currentUserId: string,
) => {
  const [result] = await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.feedId, feedId),
        eq(feedFollows.userId, currentUserId),
      ),
    )
    .returning({ id: feedFollows.id });

  return result.id;
};
