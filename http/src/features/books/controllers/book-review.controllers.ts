import { extractParamsFromUrl } from "../../../helpers/urls";
import { Path } from "../books.routes";
import { idSchema } from "../books.validation";

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
