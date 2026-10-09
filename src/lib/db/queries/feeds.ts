import { db } from '../index.js';
import { feeds, users } from '../../schema.js';
import { eq } from 'drizzle-orm';

export const addFeed = async (name: string, url: string, userId: string) => {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();

  console.log(result);
  return result;
};

export const getAllFeeds = async () => {
  const results = await db
    .select({ name: feeds.name, url: feeds.url, userName: users.name })
    .from(feeds)
    .leftJoin(users, eq(feeds.userId, users.id));

  return results;
};

export const getFeedByUrl = async (url: string) => {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));

  if (!result.length) throw new Error('No feed found with this url');

  return result[0];
};
