// import type { Request, Response } from "express";
// import { OpenAI } from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export const findMovieByDescription = async (req: Request, res: Response) => {
//     try {
//         const { description } = req.body;
//         if (!description) return res.status(400).json({ message: "Description is required" });

//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 { role: "system", content: "You help people find the horror movie they have in mind." },
//                 { role: "user", content: `Trouve-moi un film correspondant à cette description : ${description}` },
//             ],
//         });
//         const choice = response.choices?.[0]?.message?.content;

//         if (!choice) {
//             return res.status(500).json({ message: "AI did not return any result" });
//         }

//         res.status(200).json({ result: choice });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Error calling AI", error: err });
//     }
// };
// src/controllers/reaiperController.ts

//test because I DO NOT HAVE ENOUGH QUOTA THANKS CHAT GPT I AM POOR I CANNOT PAY
import type { Request, Response } from "express";

export const getAIRecommendation = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const mockResponse = {
      recommendedMovie: {
        id: "64f8e8a1b1234abcd56789ef",
        title: "The Conjuring: Last Rites",
        overview: "Paranormal investigators Ed and Lorraine Warren take on one last terrifying case.",
        releaseYear: 2025,
        averageRating: 6.955,
        posterPath: "/7JzOmJ1fIU43I3gLHYsY8UzNzjG.jpg",
      },
      message: "This is a mock AI recommendation based on your description."
    };

    return res.status(200).json(mockResponse);

  } catch (err) {
    return res.status(500).json({ message: "Error calling AI", error: err });
  }
};
