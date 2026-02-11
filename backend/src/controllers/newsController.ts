import { Request, Response } from "express";
import News from "../models/News";

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.aggregate([
      {
        $addFields: {
          sortPriority: {
            $cond: [{ $eq: ["$publishedAt", null] }, 0, 1],
          },
        },
      },
      {
        $sort: {
          sortPriority: 1,
          publishedAt: -1,
        },
      },
    ]);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news" });
  }
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const article = await News.findOne({ slug: req.params.slug });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch article" });
  }
};
