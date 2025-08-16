import { da } from "zod/v4/locales";
import { sendResponse, parseJsonBody } from "../../../helpers/httpHelpers.js";
import { validateBookCreation, idValidator } from "../books.validation.js";
import {
  getBookById,
  getAllBooks,
  createBook,
  updateBook,
} from "../models/book.models.js";
import { Book } from "../types.js";

export async function handleGetBookById(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(http.params?.id);

  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
    return;
  }

  try {
    const book = await getBookById(Number(id));

    if (!book) {
      sendResponse(http.res, 404, { message: `Book id ${id} not found` });
      return;
    }

    sendResponse(http.res, 200, { data: book });
  } catch (error) {
    sendResponse(http.res, 500, { message: "Internal Server Error" });
  }
}

export async function handleGetAllBooks(http: Http) {
  try {
    const books = await getAllBooks();

    sendResponse(http.res, 200, { data: books, total: books.length });
  } catch (error) {
    sendResponse(http.res, 500, { message: "Internal Server Error" });
  }
}

export async function handleCreateBook(http: Http) {
  const parsed = await parseJsonBody<Book>(http.req);

  if (!parsed.success) {
    sendResponse(http.res, 400, { error: parsed.error });
    return;
  }

  const validation = validateBookCreation(parsed.data);

  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
    return;
  }

  try {
    const books = await createBook(parsed.data);
    sendResponse(http.res, 201, { data: books });
  } catch (error) {
    sendResponse(http.res, 500, { message: "Something went wrong" });
  }
}

export async function handleUpdateBook(http: Http) {
  const id = http.params?.id;
  const parsed = await parseJsonBody<Book>(http.req);

  if (!parsed.success) {
    sendResponse(http.res, 400, { error: parsed.error });
    return;
  }

  const idValidation = idValidator(id);
  if (!idValidation.success) {
    sendResponse(http.res, 400, { errors: idValidation.errors });
    return;
  }

  const validation = validateBookCreation(parsed.data);
  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
    return;
  }

  try {
    const updatedBook = await updateBook(Number(id), parsed.data);
    console.log("updatedBook", updatedBook);

    sendResponse(http.res, 200, { data: updatedBook });
  } catch (error) {
    sendResponse(http.res, 500, { message: "Something went wrong" });
  }
}

export function handleDeleteBook(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(id);

  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
    return;
  }

  sendResponse(http.res, 200, { message: `Book ${id} deleted successfully` });
}

export function handlePartialUpdateBook(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(id);

  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
    return;
  }

  sendResponse(http.res, 200, { message: `Book ${id} updated successfully` });
}
