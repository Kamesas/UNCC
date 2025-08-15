import * as bControllers from "./controllers";

export const routes: Route[] = [
  {
    method: "GET",
    path: "/books/search",
    handler: bControllers?.searchBooks,
  },
  {
    method: "GET",
    path: "/books/categories",
    handler: bControllers.getBookCategories,
  },
  {
    method: "POST",
    path: "/books/categories/add",
    handler: bControllers.addBookCategory,
  },
  {
    method: "GET",
    path: "/books",
    handler: bControllers.getAllBooks,
  },
  {
    method: "POST",
    path: "/books",
    handler: bControllers.createBook,
  },
  {
    method: "GET",
    path: "/books/:id",
    handler: bControllers.getBookById,
  },
  {
    method: "PUT",
    path: "/books/:id/update",
    handler: bControllers.updateBook,
  },
  {
    method: "PATCH",
    path: "/books/:id/partial-update",
    handler: bControllers.partialUpdateBook,
  },
  {
    method: "DELETE",
    path: "/books/delete/:id",
    handler: bControllers.deleteBook,
  },
  {
    method: "GET",
    path: "/books/:id/reviews",
    handler: bControllers.getBookReviews,
  },
  {
    method: "POST",
    path: "/books/:id/reviews/add",
    handler: bControllers.addBookReview,
  },
];
