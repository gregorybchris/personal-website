export interface TvShow {
  name: string;
  media_type: string;
  genre: string;
  plot_score: number;
  characters_score: number;
  production_score: number;
  dialog_score: number;
  rank: number;
}

export interface YouTubeChannel {
  name: string;
  media_type: string;
  category: string;
  production_score: number;
  personality_score: number;
  information_score: number;
  consistency_score: number;
  rank: number;
}

export interface Movie {
  name: string;
  media_type: string;
  genre: string;
  plot_score: string;
  characters_score: string;
  production_score: string;
  dialog_score: string;
  rank: string;
}

export interface Podcast {
  name: string;
  media_type: string;
  category: string;
  production_score: string;
  personality_score: string;
  information_score: string;
  consistency_score: string;
  rank: string;
}
