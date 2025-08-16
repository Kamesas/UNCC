import path from "path";
import fsPromise from "fs/promises";
import { PROJECT_ROOT } from "../../../config/paths.js";
import { Book } from "../types";

const dbFilePath = path.join(PROJECT_ROOT, "db", "books.json");

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
