import * as bControllers from "./controllers/index.js";

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
    handler: bControllers.handleGetAllBooks,
  },
  {
    method: "POST",
    path: "/books",
    handler: bControllers.handleCreateBook,
  },
  {
    method: "GET",
    path: "/books/:id",
    handler: bControllers.handleGetBookById,
  },
  {
    method: "PATCH",
    path: "/books/:id/update",
    handler: bControllers.handleUpdateBook,
  },
  {
    method: "PUT",
    path: "/books/:id/replace",
    handler: bControllers.handleReplaceBook,
  },
  {
    method: "DELETE",
    path: "/books/delete/:id",
    handler: bControllers.handleDeleteBook,
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
