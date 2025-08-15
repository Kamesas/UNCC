import { extractParamsFromUrl } from "../../helpers/urls";
import { mockBooks } from "./books.mock";

const paths = ["/books", "/books/:id", "/books/edit/:id"] as const;
type Path = (typeof paths)[number];

import { z } from "zod";

const idSchema = z.object({
  id: z.string().regex(/^\d+$/, "id must be a number"),
});
function getBookById({ req, res }: Http) {
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

function getAllBooks({ res }: Http) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(mockBooks));
}

function createBook({ req, res }: Http) {
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

function getBookEditForm({ req, res }: Http) {
  res.end(`Showing edit form for book ID: ${req?.url}`);
}

export const routes: Route[] = [
  {
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },
  {
    method: "GET",
    path: "/books/:id",
    handler: getBookById,
  },
  {
    method: "POST",
    path: "/books",
    handler: createBook,
  },
  {
    method: "GET",
    path: "/books/edit/:id",
    handler: getBookEditForm,
  },
];
