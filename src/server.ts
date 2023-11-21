import express, { application } from "express";
import Config from "./config";

// Link Routes
import chat from "./routes/chat.js";
import imgen from "./routes/imgen.js";
import gpt from "./routes/gpt.js";

import { resolve } from "path";


// Startup Express and Connect MongoDB
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*",);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next()  
})

app.get("/", (req, res) => {
  //response messsage
  res.json({message:"Hello from Bob!"});

});

// Use Routes
app.use("/chat", chat);
app.use("/imgen", imgen);
app.use("/gpt", gpt);

export default app;
