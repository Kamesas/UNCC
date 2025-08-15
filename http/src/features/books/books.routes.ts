import {
  createBook,
  getAllBooks,
  getBookById,
  getBookEditForm,
  // updateBook,
  // deleteBook,
  // partialUpdateBook,
  // searchBooks,
  // getBookCategories,
  // addBookCategory,
  // getBookReviews,
  // addBookReview,
} from "./book.controllers";

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
  // Basic CRUD Operations
  {
    method: "GET",
    path: "/books" as Path,
    handler: getAllBooks,
  },
  {
    method: "GET",
    path: "/books/:id" as Path,
    handler: getBookById,
  },
  {
    method: "POST",
    path: "/books" as Path,
    handler: createBook,
  },
  // {
  //   method: "PUT",
  //   path: "/books/:id/update" as Path,
  //   handler: updateBook,
  // },
  // {
  //   method: "PATCH",
  //   path: "/books/:id/partial-update" as Path,
  //   handler: partialUpdateBook,
  // },
  // {
  //   method: "DELETE",
  //   path: "/books/delete/:id" as Path,
  //   handler: deleteBook,
  // },

  // Additional Functionality
  // {
  //   method: "GET",
  //   path: "/books/search" as Path,
  //   handler: searchBooks,
  // },
  {
    method: "GET",
    path: "/books/edit/:id" as Path,
    handler: getBookEditForm,
  },

  // Categories Management
  // {
  //   method: "GET",
  //   path: "/books/categories" as Path,
  //   handler: getBookCategories,
  // },
  // {
  //   method: "POST",
  //   path: "/books/categories/add" as Path,
  //   handler: addBookCategory,
  // },

  // Reviews Management
  // {
  //   method: "GET",
  //   path: "/books/:id/reviews" as Path,
  //   handler: getBookReviews,
  // },
  // {
  //   method: "POST",
  //   path: "/books/:id/reviews/add" as Path,
  //   handler: addBookReview,
  // },
];
