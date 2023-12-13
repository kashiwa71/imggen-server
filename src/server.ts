import express, { application } from "express";
import Config from "./config";
import { DbUtil } from "./utils/dbUtil.js";

// Link Routes
import chat from "./routes/chat.js";
import imgen from "./routes/imgen.js";
import gpt from "./routes/gpt.js";

import { resolve } from "path";

const db = new DbUtil();

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
  res.json({message:"access succeed!"});
});

// Use Routes
app.use("/chat", chat);
app.use("/imgen", imgen);
app.use("/gpt", gpt);

app.use("/coversation_history", async (req, res) => {
  const conversations = await db.getConversations()
    console.log(conversations);
    res.json(conversations);
});

app.use("/coversation_log/", async (req, res) => {
  const conversation_id: any = req.query.conversation_id;
  const conversations = await db.getConversationLog(conversation_id)
    console.log(conversations);
    res.json(conversations);
});

export default app;
