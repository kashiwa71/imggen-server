import { Router } from "express";
import { generateImageFiles, generateImagesLinks } from "bimg";
import { DbUtil } from "../utils/dbUtil.js";

const router = Router();

const dbUtil = new DbUtil();

router.post("/links-only/:prompt", async (req: any, res: any) => {
  try {
    const { prompt } = req.params;
    const imageLinks = await generateImagesLinks(prompt);

    // dbに保存
    dbUtil.insertImgenRecord(prompt, imageLinks);  

    return res.status(200).send(imageLinks);
  } catch (err: any) {
    console.trace(err);
    return res.status(500).send(err.message);
  }
});

export default router;
