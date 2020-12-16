interface Post {
  post_id: string;
  title: string;
  slug: string;
  content_type: string;
  source: string | null;
  areas: string[];
  series: string | null;
  speaker: string | null;
  episode_number: number | null;
  length: string | null;
  date_created: string | null;
  date_posted: string;
  link: string;
  tags: string[];
  hook: string | null;
  summary: string | null;
  paid: boolean;
  archived: boolean;
}

export default Post;
