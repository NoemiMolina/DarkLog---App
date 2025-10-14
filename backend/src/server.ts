import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js"
import userRoutes from "./routes/users.js"

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();


app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend's app is online, gg");
});

app.listen(PORT, () => {
  console.log(`server is on on port : ${PORT}`);
});



