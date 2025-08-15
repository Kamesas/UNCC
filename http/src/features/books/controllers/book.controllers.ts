import { sendResponse } from "../../../helpers/sendResponse";
import { idValidator } from "../books.validation";
import { findBookById, findAllBooks } from "../models/book.models";

export async function getBookById(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(http.params?.id);

  if (!validation.success) {
    sendResponse({
      res: http.res,
      status: 400,
      data: { errors: validation.errors },
    });
    return;
  }

  try {
    const book = await findBookById(Number(id));

    if (!book) {
      sendResponse({
        data: { message: `Book id ${id} not found` },
        res: http.res,
        status: 404,
      });
      return;
    }

    sendResponse({ data: book, res: http.res, status: 200 });
  } catch (error) {
    sendResponse({
      status: 500,
      res: http.res,
      data: { message: "Internal Server Error" },
    });
  }
}

export async function getAllBooks(http: Http) {
  try {
    const books = await findAllBooks();
    sendResponse({
      data: { books, total: books.length },
      res: http.res,
      status: 200,
    });
  } catch (error) {
    sendResponse({
      status: 500,
      res: http.res,
      data: { message: "Internal Server Error" },
    });
  }
}

export function createBook({ req, res }: Http) {
  const body: Buffer[] = [];
  console.log("req.headers --->", req.headers);

  req.on("data", (chunk) => {
    console.log("chunk --->", chunk);
    body.push(chunk);
  });

  req.on("end", () => {
    console.log("body --->", body);
    const bodyString = Buffer.concat(body).toString();
    console.log("bodyString --->", bodyString);

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 201;
    res.end(
      JSON.stringify({
        message: "Book created",
      })
    );
  });
}

export function updateBook(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(id);

  if (!validation.success) {
    sendResponse({
      res: http.res,
      status: 400,
      data: { errors: validation.errors },
    });
    return;
  }

  sendResponse({
    data: { message: `Book ${id} updated successfully` },
    res: http.res,
    status: 200,
  });
}

export function deleteBook(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(id);

  if (!validation.success) {
    sendResponse({
      res: http.res,
      status: 400,
      data: { errors: validation.errors },
    });
    return;
  }

  sendResponse({
    data: { message: `Book ${id} deleted successfully` },
    res: http.res,
    status: 200,
  });
}

export function partialUpdateBook(http: Http) {
  const id = http.params?.id;
  const validation = idValidator(id);

  if (!validation.success) {
    sendResponse({
      res: http.res,
      status: 400,
      data: { errors: validation.errors },
    });
    return;
  }

  sendResponse({
    data: { message: `Book ${id} partially updated successfully` },
    res: http.res,
    status: 200,
  });
}
