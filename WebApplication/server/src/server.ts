import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/authRoutes";

dotenv.config();
const app = express(); // create express application

/* Cross-Origin Resource Sharing */
app.use(cors()); // "app.use()" - means adding middleware. Cors() that means in every http requests will be cors
app.use(express.json()); // "express.json" - coverts response into json

// Подключаем наши маршруты
app.use("/api/auth", router);

app.listen(5050, () => console.log("Server running on port 5050"));
