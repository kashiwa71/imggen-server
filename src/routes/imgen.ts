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
      .then((result) => {

        const parsed_result: string = result[0].replace(/'/g, '"')
        let messages_json: string[] = [];

        try {
          // '['hoge', 'huga']' という形式なので、JSON.parseで配列に変換
          const messages_json = JSON.parse(parsed_result);
        } catch (err) {
            console.error(err);
            dbUtil.insertImgenRecord(prompt, ['failed to generate images']);
            return res.status(500).send('Error: failed to generate images');
        }

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
