import { Router } from "express";
import OpenAI from "openai";
import 'dotenv/config';
import { DbUtil } from "../utils/dbUtil.js";

import * as dotenv from 'dotenv';
dotenv.config();

const router = Router();

const openai = new OpenAI();  // defaults to process.env["OPENAI_API_KEY"]

const dbUtil = new DbUtil();

router.post("/", async (req, res, next) => {

    try {
        const prompt: string = req.body.prompt;
        const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                "role": "user",
                "content": prompt,
            }],            
            temperature: 0.9,
            max_tokens: 150,
        });
        
        // convert OpenAI.Chat.Completions.ChatCompletion to json
        const json = JSON.stringify(response.choices[0].message);

        // dbに保存

        dbUtil.insertChatRecord(prompt, json);

        return res.status(200).send(json);
    }catch (err: any) {
        console.trace(err);
        return res.status(500).send(err.message);
    }
})

export default router;
