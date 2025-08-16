import { sendResponse, parseJsonBody } from "../../../helpers/httpHelpers.js";
import { validateBookCreation, idValidator } from "../books.validation.js";
import { getBookById, getAllBooks, createBook } from "../models/book.models.js";
import { Book } from "../types";

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
    console.log("handleGetAllBooks");

    const books = await getAllBooks();
    console.log("books", books);

    sendResponse(http.res, 200, { data: books, total: books.length });
  } catch (error) {
    sendResponse(http.res, 500, { message: "Internal Server Error" });
  }
}

export async function handleCreateBook({ req, res }: Http) {
  const parsed = await parseJsonBody<Book>(req);

  if (!parsed.success) {
    sendResponse(res, 400, { error: parsed.error });
    return;
  }

  const validation = validateBookCreation(parsed.data);

  if (!validation.success) {
    sendResponse(res, 400, { errors: validation.errors });
    return;
  }

  try {
    const books = await createBook(parsed.data);
    sendResponse(res, 201, { data: books });
  } catch (error) {
    sendResponse(res, 500, { message: "Something went wrong" });
  }
}

export function handleUpdateBook(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(id);

  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
    return;
  }
  sendResponse(http.res, 200, { message: `Book ${id} updated successfully` });
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
