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
