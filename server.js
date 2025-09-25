const { createServer } = require("http");
const url = require("url");
const emailPath = "/shohinalimov2008_gmail_com";

function NOD(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function NOK(a, b) {
  return (a * b) / NOD(a, b);
}

const server = createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname === emailPath) {
    let x = parseInt(parsed.query.x);
    let y = parseInt(parsed.query.y);

    if (!Number.isInteger(x) || !Number.isInteger(y) || x <= 0 || y <= 0) {
      res.end("NaN");
    } else {
      res.end(NOK(x, y).toString());
    }
  } else {
    res.statusCode = 404;
    res.end("NaN");
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
