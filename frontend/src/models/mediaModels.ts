export interface TvShow {
  name: string;
  media_type: string;
  genre: string;
  scores: {
    plot: number;
    characters: number;
    production: number;
    dialog: number;
  };
  rank: number;
}

export interface YouTubeChannel {
  name: string;
  media_type: string;
  category: string;
  scores: {
    production: number;
    personality: number;
    information: number;
    consistency: number;
  };
  rank: number;
}

export interface Movie {
  name: string;
  media_type: string;
  genre: string;
  scores: {
    plot: number;
    characters: number;
    production: number;
    dialog: number;
  };
  rank: number;
}

export interface Podcast {
  name: string;
  media_type: string;
  category: string;
  scores: {
    production: number;
    personality: number;
    information: number;
    consistency: number;
  };
  rank: number;
}
