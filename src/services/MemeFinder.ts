import axios from 'axios';
import { Logger } from '@/utils';

interface RedditPost {
  title: string;
  url: string;
  permalink: string;
  is_video: boolean;
  post_hint?: string;
  subreddit: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
    }>;
  };
}

interface RedditResponse {
  kind: string;
  data: {
    after: string | null;
    before: string | null;
    children: Array<{
      kind: string;
      data: RedditPost;
    }>;
  };
}

export class MemeFinder {
  private logger: Logger;
  private subreddits: string[] = ['memes', 'dankmemes', 'funny'];
  private lastFetch: { [key: string]: RedditPost[] } = {};
  private lastFetchTime: { [key: string]: number } = {};

  constructor(logger: Logger) {
    this.logger = logger;
  }

  private async fetchFromSubreddit(subreddit: string): Promise<RedditPost[]> {
    try {
      const response = await axios.get<RedditResponse>(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`,
        {
          headers: {
            'User-Agent': 'DareBot/1.0.0',
          },
        },
      );

      const posts = response.data.data.children
        .map((post) => post.data)
        .filter((post: RedditPost) => {
          // Filtra apenas imagens e GIFs
          return (
            !post.is_video &&
            (post.post_hint === 'image' || post.url.endsWith('.gif'))
          );
        });

      this.lastFetch[subreddit] = posts;
      this.lastFetchTime[subreddit] = Date.now();
      return posts;
    } catch (error) {
      await this.logger.error(
        'MemeFinder',
        `Erro ao buscar memes do r/${subreddit}: ${error}`,
      );
      return [];
    }
  }

  async getRandomMeme(): Promise<{
    title: string;
    url: string;
    permalink: string;
    subreddit: string;
    author: string;
    score: number;
    num_comments: number;
    created_utc: number;
  }> {
    const randomSubreddit =
      this.subreddits[Math.floor(Math.random() * this.subreddits.length)];

    // Verifica se precisa atualizar o cache (mais de 5 minutos)
    if (
      !this.lastFetch[randomSubreddit] ||
      Date.now() - this.lastFetchTime[randomSubreddit] > 5 * 60 * 1000
    ) {
      await this.fetchFromSubreddit(randomSubreddit);
    }

    const posts = this.lastFetch[randomSubreddit];
    if (!posts || posts.length === 0) {
      throw new Error('Nenhum meme encontrado. Tente novamente mais tarde.');
    }

    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    return {
      title: randomPost.title,
      url: randomPost.url,
      permalink: `https://reddit.com${randomPost.permalink}`,
      subreddit: randomPost.subreddit,
      author: randomPost.author,
      score: randomPost.score,
      num_comments: randomPost.num_comments,
      created_utc: randomPost.created_utc,
    };
  }

  async getMemeFromSubreddit(subreddit: string): Promise<{
    title: string;
    url: string;
    permalink: string;
    subreddit: string;
    author: string;
    score: number;
    num_comments: number;
    created_utc: number;
  }> {
    if (!this.subreddits.includes(subreddit)) {
      throw new Error(
        `Subreddit ${subreddit} não suportado. Use: ${this.subreddits.join(
          ', ',
        )}`,
      );
    }

    const posts = await this.fetchFromSubreddit(subreddit);
    if (!posts || posts.length === 0) {
      throw new Error(
        `Nenhum meme encontrado em r/${subreddit}. Tente novamente mais tarde.`,
      );
    }

    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    return {
      title: randomPost.title,
      url: randomPost.url,
      permalink: `https://reddit.com${randomPost.permalink}`,
      subreddit: randomPost.subreddit,
      author: randomPost.author,
      score: randomPost.score,
      num_comments: randomPost.num_comments,
      created_utc: randomPost.created_utc,
    };
  }
}
