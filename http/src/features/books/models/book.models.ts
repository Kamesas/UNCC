import { Book, mockBooks } from "../../../data/books";

const TIME_OUT = 2000;
export async function findBookById(id: number): Promise<Book | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const book = mockBooks.find((book) => book.id === id);
      resolve(book);
    }, TIME_OUT);
  });
}

export async function findAllBooks(): Promise<typeof mockBooks> {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBooks);
    }, TIME_OUT);
  });
}
