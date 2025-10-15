import express from "express";
import cors from "cors";
import router from "./routes/authRoutes";
import cookieParser from "cookie-parser";

const app = express();

// middleware

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // allow cookies to be sent
  })
);

// ROUTES

// register and login routes
app.use("/api/auth", router);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
