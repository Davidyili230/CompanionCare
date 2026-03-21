import express from "express"; 
import cors from "cors";
import path from "path"
import communityRoutes from "./routes/community.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import ebayRecommendationsRoute from "./routes/ebayRecommendations.js";

const app = express();
app.use(express.json()); //allow back to accept json type data // Ruifeng
app.use(
   cors({
      origin: "*"
   }),
);

app.get("/", (req, res) => {
   res.send("Hello! our endpoint is working!!!");
}); //just a message that show backend is working // Ruifeng


const Upload_Dir = path.join(process.cwd(), "uploads")  //current working directory

app.use("/uploads", express.static(Upload_Dir))
app.use("/api/community", communityRoutes)
app.use("/api/uploads", uploadRoutes)
app.use("/api/ebay-recommendations", ebayRecommendationsRoute);


const PORT = 8080;
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
//use http://localhost:8080 visit the website in your own computer
// use command npx nodemon server.js // Ruifeng


