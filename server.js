const { createServer } = require("http");
const url = require("url");
const emailPath = "/shohinalimov2008_gmail_com";

function NOD(a, b) {
  while (b !== 0n) {
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
    try {
      let x = BigInt(parsed.query.x);
      let y = BigInt(parsed.query.y);

      if (x <= 0n || y <= 0n) {
        res.end("NaN");
      } else {
        res.end(NOK(x, y).toString());
      }
    } catch (e) {
      res.end("NaN");
    }
  } else {
    res.statusCode = 404;
    res.end("NaN");
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
