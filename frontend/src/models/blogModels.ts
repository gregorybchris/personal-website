export interface BlogPost {
  title: string;
  slug: string;
  topics: string[];
  date: string;
  content: string;
  archived: boolean;
}

export interface BlogPostMetadata {
  title: string;
  slug: string;
  topics: string[];
  date: string;
  archived: boolean;
}
