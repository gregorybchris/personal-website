export default interface BookData {
  isbn: string;
  title: string;
  subtitle?: string;
  author: string;
  year_read: number;
  recommendability: number;
  tags: string[];
  goodreads_link: string;
  image_links: {
    book: string;
    square: string;
  };
}
