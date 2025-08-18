import path from "path";
import fsPromise from "fs/promises";
import { PROJECT_ROOT } from "../../../config/paths.js";
import { Book } from "../types.js";

const dbFilePath = path.join(PROJECT_ROOT, "db", "books33.json");

export async function getAllBooks(): Promise<Book[]> {
  const data = await fsPromise.readFile(dbFilePath, "utf-8");
  return JSON.parse(data) as Book[];
}

export async function getBookById(id: number): Promise<Book | undefined> {
  const books = await getAllBooks();
  return books.find((b) => b.id === id);
}

export async function createBook(book: Book) {
  try {
    const books = await getAllBooks();
    const updatedBooks = [...books, { ...book, id: Date.now() }];
    await fsPromise.writeFile(dbFilePath, JSON.stringify(updatedBooks));

    return updatedBooks;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

export async function updateBook(id: number, book: Book) {
  try {
    const books = await getAllBooks();
    let updatedBook: Book | undefined;
    const updatedBooks = books.map((b) => {
      if (b.id === id) {
        updatedBook = { ...b, ...book };
        return updatedBook;
      }
      return b;
    });

    await fsPromise.writeFile(dbFilePath, JSON.stringify(updatedBooks));
    return updatedBook;
  } catch (error) {
    throw error;
  }
}

export async function deleteBook(id: number) {
  try {
    const books = await getAllBooks();
    const updatedBooks = books.filter((b) => b.id !== id);
    await fsPromise.writeFile(dbFilePath, JSON.stringify(updatedBooks));
    return updatedBooks;
  } catch (error) {
    throw error;
  }
}

export async function replaceBook(id: number, book: Book) {
  try {
    const books = await getAllBooks();
    let replacedBook: Book | undefined;
    const updatedBooks = books.map((b) => {
      if (b.id === id) {
        replacedBook = { ...book, id: id };
        return replacedBook;
      }
      return b;
    });

    await fsPromise.writeFile(dbFilePath, JSON.stringify(updatedBooks));
    return replacedBook;
  } catch (error) {
    throw error;
  }
}
