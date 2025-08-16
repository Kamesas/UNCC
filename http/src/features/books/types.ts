export type Book = {
  id: number;
  title: string;
  author?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
};
