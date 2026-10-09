import { XMLParser } from 'fast-xml-parser';

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export const isValidModernDate = (dateString: string) => {
  const timestamp = Date.parse(dateString);

  if (isNaN(timestamp)) return false;

  const dateObj = new Date(timestamp);

  let year = dateObj.getUTCFullYear();

  const yearMatch = dateString.match(/\b\d{4}\b/);

  if (yearMatch) {
    const literalYear = parseInt(yearMatch[0], 10);
    if (literalYear < year) year = literalYear;
  }

  return year >= 1970;
};

export const fetchFeed = async (feedUrl: string) => {
  const request = await fetch(feedUrl, {
    headers: {
      'User-Agent': 'gator',
    },
  });

  const response = await request.text();

  const parser = new XMLParser();

  const parsedData = parser.parse(response);

  if (!parsedData.rss.channel) {
    throw new Error('Unable to fetch the rss feed');
  }

  const { title, link, description } = parsedData.rss.channel;

  let feedItems: RSSItem[] = [];

  if (
    parsedData.rss.channel.item &&
    Array.isArray(parsedData.rss.channel.item)
  ) {
    feedItems = [...parsedData.rss.channel.item];
  }

  const items = feedItems.filter((item) => {
    if (!item.title || item.title.length === 0) return false;

    if (!item.description || item.description.length === 0) return false;

    if (!item.link || item.link.length === 0) return false;

    if (!item.pubDate || item.pubDate.length === 0) return false;

    return isValidModernDate(item.pubDate);
  });

  const rssObj = {
    channel: {
      title: title as string,
      description: description as string,
      link: link as string,
      item: items,
    },
  } satisfies RSSFeed;

  return rssObj;
};
