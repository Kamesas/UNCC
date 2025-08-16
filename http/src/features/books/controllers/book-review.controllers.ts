import { sendResponse } from "../../../helpers/httpHelpers.js";
import { idValidator } from "../books.validation.js";

export function getBookReviews(http: Http) {
  const id = http.params?.id;

  const validation = idValidator(http.params?.id);

  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
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

  sendResponse(http.res, 200, mockReviews);
}

export function addBookReview(http: Http) {
  const { req, res } = http;
  const id = http.params?.id;

  const validation = idValidator(http.params?.id);

  if (!validation.success) {
    sendResponse(http.res, 400, { errors: validation.errors });
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
