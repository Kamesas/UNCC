import {
  // Main book CRUD
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  partialUpdateBook,
  getBookEditForm,
  // Search
  searchBooks,
  // Categories
  getBookCategories,
  addBookCategory,
  // Reviews
  getBookReviews,
  addBookReview,
} from "./controllers";

const paths = [
  "/books",
  "/books/:id",
  "/books/edit/:id",
  "/books/delete/:id",
  "/books/search",
  "/books/:id/update",
  "/books/:id/partial-update",
  "/books/categories",
  "/books/categories/add",
  "/books/:id/reviews",
  "/books/:id/reviews/add",
] as const;

export type Path = (typeof paths)[number];

export const routes: Route[] = [
  {
    method: "GET",
    path: "/books/search" as Path,
    handler: searchBooks,
  },
  {
    method: "GET",
    path: "/books/categories" as Path,
    handler: getBookCategories,
  },
  {
    method: "POST",
    path: "/books/categories/add" as Path,
    handler: addBookCategory,
  },
  {
    method: "GET",
    path: "/books" as Path,
    handler: getAllBooks,
  },
  {
    method: "POST",
    path: "/books" as Path,
    handler: createBook,
  },
  {
    method: "GET",
    path: "/books/:id" as Path,
    handler: getBookById,
  },
  {
    method: "GET",
    path: "/books/edit/:id" as Path,
    handler: getBookEditForm,
  },
  {
    method: "PUT",
    path: "/books/:id/update" as Path,
    handler: updateBook,
  },
  {
    method: "PATCH",
    path: "/books/:id/partial-update" as Path,
    handler: partialUpdateBook,
  },
  {
    method: "DELETE",
    path: "/books/delete/:id" as Path,
    handler: deleteBook,
  },
  {
    method: "GET",
    path: "/books/:id/reviews" as Path,
    handler: getBookReviews,
  },
  {
    method: "POST",
    path: "/books/:id/reviews/add" as Path,
    handler: addBookReview,
  },
];
