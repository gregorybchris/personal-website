export interface TvShow {
  name: string;
  genre: string;
  scores: {
    plot: number;
    characters: number;
    production: number;
    dialog: number;
  };
  rank: number;
  link: string;
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
  rank: number;
  link: string;
}

export interface Movie {
  name: string;
  genre: string;
  scores: {
    plot: number;
    characters: number;
    production: number;
    dialog: number;
  };
  rank: number;
  link: string;
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
  rank: number;
  apple_link: string;
  pocket_casts_link: string;
  pocket_casts_id: string;
}
