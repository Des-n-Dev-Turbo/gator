import { pgTable, timestamp, uuid, text, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text('name').notNull().unique(),
});

export const feeds = pgTable('feeds', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  url: text('url').notNull().unique(),
  name: text('name').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const feedFollows = pgTable(
  'feed_follows',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    feedId: uuid('feed_id').references(() => feeds.id, { onDelete: 'cascade' }),
  },
  (t) => [unique().on(t.userId, t.feedId)],
);

export type Feed = typeof feeds.$inferSelect;
export type User = typeof feeds.$inferSelect;
