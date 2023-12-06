import { Router } from "express";
import { generateImageFiles, generateImagesLinks } from "bimg";
import { DbUtil } from "../utils/dbUtil.js";
import { PythonShell } from "python-shell";

import dotenv from 'dotenv';
dotenv.config({ path: '.env', debug: true });

const router = Router();

const dbUtil = new DbUtil();


router.post("/links-only/:prompt", async (req: any, res: any) => {
  try {
    const prompt: string = req.params['prompt'];

    const options: any = {
      mode: 'text',
      args: [process.env.BING_IMAGE_COOKIE, prompt],
      pythonOptions: ['-u'],
    }

    await PythonShell.run('src/utils/bingImageCreater_util.py', options)
      .then((messages) => {
        // '['hoge', 'huga']' という形式なので、JSON.parseで配列に変換
        const messages_json: string[] = JSON.parse(messages[0].replace(/'/g, '"'));
        // レスポンスになぜかsvgが含まれているので、それを除外
        const urls = messages_json.filter(item => !item.endsWith('.svg'));

        dbUtil.insertImgenRecord(prompt, urls);  

        return res.status(200).send(urls);
      });


  } catch (err: any) {
    console.trace(err);
    return res.status(500).send(err.message);
  }
});

export default router;
