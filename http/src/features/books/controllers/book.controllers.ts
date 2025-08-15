import { mockBooks } from "../../../data/books";
import { idSchema } from "../books.validation";

export async function getBookById({ res, params }: Http) {
  const { id } = params || {};

  const result = idSchema.safeParse({ id });

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: result.error.issues,
        message: result.error.message,
      })
    );
    return;
  }

  try {
    const book = await new Promise((resolve) => {
      setTimeout(() => {
        const book = mockBooks.find((book) => book.id === Number(id));
        resolve(book);
      }, 2000);
    });

    res.setHeader("Content-Type", "application/json");

    if (!book) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: `Book id ${id} not found` }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(book));
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Internal Server Error", error }));
  }
}

export async function getAllBooks({ res }: Http) {
  try {
    const books: typeof mockBooks = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBooks);
      }, 2000);
    });

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ books, total: books.length }));
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Internal Server Error", error }));
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

export function updateBook({ res, params }: Http) {
  const { id } = params || {};

  const result = idSchema.safeParse({ id });

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid book ID" }));
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify({ message: `Book ${id} updated successfully` }));
}

export function deleteBook({ res, params }: Http) {
  const { id } = params || {};

  const result = idSchema.safeParse({ id });

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid book ID" }));
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify({ message: `Book ${id} deleted successfully` }));
}

export function partialUpdateBook({ res, params }: Http) {
  const { id } = params || {};

  const result = idSchema.safeParse({ id });

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid book ID" }));
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(
    JSON.stringify({ message: `Book ${id} partially updated successfully` })
  );
}
