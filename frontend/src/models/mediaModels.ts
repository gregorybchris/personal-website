export interface TvShow {
  name: string;
  genres: string[];
  scores: {
    plot: number;
    characters: number;
    production: number;
    dialog: number;
  };
  link: string;
  poster_url?: string;
}

export interface YouTubeChannel {
  name: string;
  category: string;
  scores: {
    production: number;
    personality: number;
    information: number;
    consistency: number;
  };
  link: string;
}

export interface Movie {
  name: string;
  genres: string[];
  scores: {
    plot: number;
    characters: number;
    production: number;
    dialog: number;
  };
  link: string;
  poster_url?: string;
}

export interface Podcast {
  name: string;
  category: string;
  scores: {
    production: number;
    personality: number;
    information: number;
    consistency: number;
  };
  apple_link: string;
  pocket_casts_link: string;
  pocket_casts_id: string;
}

export interface Tiktok {
  id: string;
  url: string;
  tags: string[];
  creator?: string;
  favorite: boolean;
}

export interface Instagram {
  id: string;
  url: string;
  tags: string[];
  creator?: string;
  favorite: boolean;
}

export interface Meme {
  id: string;
  url: string;
  tags: string[];
  favorite: boolean;
  format: string;
  era: string;
}

export interface YouTubeVideo {
  id: string;
  url: string;
  tags: string[];
  creator?: string;
  favorite: boolean;
}
