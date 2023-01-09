export default interface BookData {
  isbn: string;
  title: string;
  subtitle?: string;
  author: string;
  year_read: number;
  recommendability: number;
  tags: string[];
}
