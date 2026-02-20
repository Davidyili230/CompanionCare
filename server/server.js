import express from "express";
import cors from "cors";

const app = express();

app.use(express.json()); //allow back to accept json type data // Ruifeng
app.use(
   cors({
      origin: ["http://localhost:5173"],
   }),
);

app.get("/", (req, res) => {
   // res.json({ message: "Backend is working!" });
   res.send("Hello! our endpoint is working!!!");
}); //just a message that show backend is working // Ruifeng

const PORT = 8080;
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
//use http://localhost:8080 visit the website in your own computer
// use command npx nodemon server.js // Ruifeng
