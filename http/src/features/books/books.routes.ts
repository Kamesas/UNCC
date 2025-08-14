function getBookById(ctx: Http) {
  ctx.res.end(`Getting book with ID: ${ctx.req?.url}`);
}

function getAllBooks(ctx: Http) {
  ctx.res.setHeader("Content-Type", "application/json");
  ctx.res.end(
    JSON.stringify([
      { id: 1, title: "Book One" },
      { id: 2, title: "Book Two" },
    ])
  );
}

function createBook(ctx: Http) {
  const { res, req } = ctx;

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

function getBookEditForm(ctx: Http) {
  ctx.res.end(`Showing edit form for book ID: ${ctx.req?.url}`);
}

export const routes: Route[] = [
  {
    method: "GET",
    path: "/book",
    handler: getAllBooks,
  },
  {
    method: "GET",
    path: "/book/:id",
    handler: getBookById,
  },
  {
    method: "POST",
    path: "/book",
    handler: createBook,
  },
  {
    method: "GET",
    path: "/book/edit/:id",
    handler: getBookEditForm,
  },
];
