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
    const options: any = {
      mode: 'text',
      args: [process.env.BING_IMAGE_COOKIE, req.params['prompt']],
      pythonOptions: ['-u'],
    }

    await PythonShell.run('src/utils/bingImageCreater_util.py', options)
      .then((messages) => {
        // '['hoge', 'huga']' という形式なので、JSON.parseで配列に変換
        let messages_json: string[] = JSON.parse(messages[0].replace(/'/g, '"'));
        // レスポンスになぜかsvgが含まれているので、それを除外
        let url = messages_json.filter(item => !item.endsWith('.svg'));
        return res.status(200).send(url);
      });

    //// dbに保存
    //   dbUtil.insertImgenRecord(prompt, imageLinks);  

  } catch (err: any) {
    console.trace(err);
    return res.status(500).send(err.message);
  }
});

export default router;
