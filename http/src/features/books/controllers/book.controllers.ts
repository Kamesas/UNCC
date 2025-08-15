import { extractParamsFromUrl } from "../../../helpers/urls";
import { mockBooks } from "./books.mock";
import { Path } from "../books.routes";
import { idSchema } from "../books.validation";

export function getBookById({ req, res }: Http) {
  const { id } = extractParamsFromUrl<{ id: string }>(
    req.url || "",
    "/books/:id" as Path
  );

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
    const book = mockBooks.find((book) => book.id === Number(id));

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

export function getAllBooks({ res }: Http) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(mockBooks));
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

export function updateBook({ req, res }: Http) {
  const { id } = extractParamsFromUrl<{ id: string }>(
    req.url || "",
    "/books/:id/update" as Path
  );

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

export function deleteBook({ req, res }: Http) {
  const { id } = extractParamsFromUrl<{ id: string }>(
    req.url || "",
    "/books/delete/:id" as Path
  );

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

export function partialUpdateBook({ req, res }: Http) {
  const { id } = extractParamsFromUrl<{ id: string }>(
    req.url || "",
    "/books/:id/partial-update" as Path
  );

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

export function getBookEditForm({ req, res }: Http) {
  res.end(`Showing edit form for book ID: ${req?.url}`);
}
