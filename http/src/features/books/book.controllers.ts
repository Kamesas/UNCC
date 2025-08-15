import { extractParamsFromUrl } from "../../helpers/urls";
import { mockBooks } from "./books.mock";
import { Path } from "./books.routes";
import { idSchema } from "./books.validation";

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

export function getBookEditForm({ req, res }: Http) {
  res.end(`Showing edit form for book ID: ${req?.url}`);
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

export function searchBooks({ req, res }: Http) {
  const url = new URL(req.url || "", "http://localhost");
  const query = url.searchParams.get("q") || "";

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      message: `Searching books with query: "${query}"`,
      results: [],
    })
  );
}

export function getBookCategories({ res }: Http) {
  const mockCategories = [
    { id: 1, name: "Fiction" },
    { id: 2, name: "Non-Fiction" },
    { id: 3, name: "Science Fiction" },
    { id: 4, name: "Mystery" },
    { id: 5, name: "Biography" },
  ];

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(mockCategories));
}

export function addBookCategory({ req, res }: Http) {
  const body: Buffer[] = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const bodyString = Buffer.concat(body).toString();

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 201;
    res.end(
      JSON.stringify({
        message: "Book category created successfully",
        data: bodyString,
      })
    );
  });
}

export function getBookReviews({ req, res }: Http) {
  const { id } = extractParamsFromUrl<{ id: string }>(
    req.url || "",
    "/books/:id/reviews" as Path
  );

  const result = idSchema.safeParse({ id });

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid book ID" }));
    return;
  }

  const mockReviews = [
    {
      id: 1,
      bookId: Number(id),
      rating: 5,
      comment: "Excellent book!",
      reviewer: "John Doe",
    },
    {
      id: 2,
      bookId: Number(id),
      rating: 4,
      comment: "Really enjoyed it",
      reviewer: "Jane Smith",
    },
  ];

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(mockReviews));
}

export function addBookReview({ req, res }: Http) {
  const { id } = extractParamsFromUrl<{ id: string }>(
    req.url || "",
    "/books/:id/reviews/add" as Path
  );

  const result = idSchema.safeParse({ id });

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid book ID" }));
    return;
  }

  const body: Buffer[] = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const bodyString = Buffer.concat(body).toString();

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 201;
    res.end(
      JSON.stringify({
        message: `Review added to book ${id}`,
        data: bodyString,
      })
    );
  });
}
